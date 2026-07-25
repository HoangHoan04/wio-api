import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { MusicBackgroundRepository } from '@/repositories';
import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bull';
import { FindOptionsWhere } from 'typeorm';
import { UploadFileService } from '../upload-file/upload-file.service';
import {
  YoutubeAudioProviderType,
  YoutubeAudioService,
} from '../youtube-audio';
import {
  CreateMusicBackgroundDto,
  ImportYoutubeDto,
  UpdateMusicBackgroundDto,
} from './dto';

@Injectable()
export class MusicBackgroundService {
  private readonly logger = new Logger(MusicBackgroundService.name);

  constructor(
    private readonly musicRepo: MusicBackgroundRepository,
    private readonly uploadFileService: UploadFileService,
    private readonly youtubeAudioService: YoutubeAudioService,
    @InjectQueue('youtube-import') private readonly youtubeQueue: Queue,
  ) {}

  async paginationActive(data?: PaginationDto<any>, user?: UserDto) {
    const { skip = 0, take = 10, where = {} } = data || {};
    const whereCon: FindOptionsWhere<any> = {
      isDeleted: false,
      isActive: true,
      status: enumData.MUSIC_PROCESS_STATUS.COMPLETED.code,
    };

    if (where.type === 'user' && user) {
      whereCon.type = 'user';
      whereCon.createdBy = user.id;
    } else {
      whereCon.type = 'admin';
    }

    const [list, total] = await this.musicRepo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  async pagination(data: PaginationDto<any>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<any> = { isDeleted: false };

    const [list, total] = await this.musicRepo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  async findOne(id: string) {
    const music = await this.musicRepo.findOne({ where: { id } });
    if (!music) {
      throw new NotFoundException('Không tìm thấy nhạc nền');
    }
    return music;
  }

  async create(createDto: CreateMusicBackgroundDto, user?: UserDto) {
    const music = this.musicRepo.create({
      ...createDto,
      status: enumData.MUSIC_PROCESS_STATUS.COMPLETED.code,
      createdBy: user?.id,
    });
    return this.musicRepo.save(music);
  }

  async update(id: string, updateDto: UpdateMusicBackgroundDto) {
    const music = await this.findOne(id);
    Object.assign(music, updateDto);
    return this.musicRepo.save(music);
  }

  async remove(id: string) {
    const music = await this.findOne(id);
    return this.musicRepo.remove(music);
  }

  async incrementUsage(data: IdDto) {
    const music = await this.findOne(data.id);
    music.usageCount += 1;
    return this.musicRepo.save(music);
  }

  async importYoutube(dto: ImportYoutubeDto, user?: UserDto) {
    const provider = dto.provider || 'python-yt-dlp';
    const videoId = this.extractYoutubeVideoId(dto.youtubeUrl);
    if (!videoId) {
      throw new BadRequestException('Link YouTube không hợp lệ');
    }

    let title = 'YouTube Audio';
    let author = 'Unknown';

    try {
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const res = await fetch(oEmbedUrl);
      if (res.ok) {
        const data = await res.json() as any;
        title = data.title || title;
        author = data.author_name || author;
      }
    } catch (e) {
      this.logger.warn(`oEmbed failed during import submission: ${e}`);
    }

    const jobData = {
      youtubeUrl: dto.youtubeUrl,
      title,
      author,
      duration: '—',
      provider,
      userId: user?.id,
      type: dto.type || 'user',
    };

    this.logger.log(`[IMPORT] Attempting to add job to queue (provider=${provider})...`);
    const queueTimeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Queue timeout — Redis unavailable')), 1000),
    );

    try {
      await Promise.race([
        this.youtubeQueue.add('import', jobData, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
        }),
        queueTimeout,
      ]);
      this.logger.log(
        `[IMPORT] Enqueued job via Redis queue. URL=${dto.youtubeUrl} provider=${provider}`,
      );
    } catch (queueError: any) {
      this.logger.warn(
        `[IMPORT] Queue unavailable (${queueError.message}), running directly in background...`,
      );
      setImmediate(() => {
        this.processYoutube(jobData).catch((err) => {
          this.logger.error(`[IMPORT] Background processing failed: ${err.message}`);
        });
      });
    }

    return { message: 'Đã thêm vào hàng đợi xử lý', provider };
  }

  async processYoutube(data: {
    youtubeUrl: string;
    title: string;
    author: string;
    duration: string;
    provider: YoutubeAudioProviderType;
    userId?: string;
    type?: string;
  }) {
    let music: any = null;
    const startTime = Date.now();
    const elapsed = () => `${((Date.now() - startTime) / 1000).toFixed(1)}s`;

    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`[IMPORT START] provider=${data.provider}`);
    this.logger.log(`[IMPORT] URL: ${data.youtubeUrl}`);
    this.logger.log(`[IMPORT] Title: ${data.title}`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    try {
      this.logger.log(`[IMPORT][${elapsed()}] Step 1/4: Saving DB record (status=PROCESSING)...`);
      music = this.musicRepo.create({
        name: data.title,
        author: data.author,
        duration: data.duration,
        youtubeUrl: data.youtubeUrl,
        status: enumData.MUSIC_PROCESS_STATUS.PROCESSING.code,
        isActive: false,
        usageCount: 0,
        type: data.type || 'user', 
        createdAt: new Date(),
        createdBy: data.userId, 
      });
      await this.musicRepo.save(music);
      this.logger.log(`[IMPORT][${elapsed()}] Step 1/4: DB record saved. musicId=${music.id}`);

      this.logger.log(`[IMPORT][${elapsed()}] Step 2/4: Starting audio download via ${data.provider}...`);
      this.logger.log(`[IMPORT][${elapsed()}]   → This may take several minutes for large videos`);

      const result = await this.youtubeAudioService.downloadAudio(
        data.youtubeUrl,
        data.provider,
        { maxDurationSeconds: 600 },
      );

      this.logger.log(`[IMPORT][${elapsed()}] Step 2/4: Download complete.`);
      this.logger.log(`[IMPORT][${elapsed()}]   → hasStream=${!!result.stream} hasFilePath=${!!result.filePath} hasDirectUrl=${!!result.directUrl}`);
      this.logger.log(`[IMPORT][${elapsed()}]   → mimeType=${result.mimeType}`);

      this.logger.log(`[IMPORT][${elapsed()}] Step 3/4: Uploading audio to storage...`);

      let uploadResult: { fileName: string; fileUrl: string };

      if (result.stream) {
        this.logger.log(`[IMPORT][${elapsed()}]   → Uploading from stream...`);
        uploadResult = await this.uploadFileService.uploadAudioFromStream(
          result.stream,
          'wio-audio-background',
          result.mimeType,
        );
      } else if (result.filePath) {
        this.logger.log(`[IMPORT][${elapsed()}]   → Uploading from file: ${result.filePath}`);
        uploadResult = await this.uploadFileService.uploadAudioFromFilePath(
          result.filePath,
          'wio-audio-background',
          result.mimeType,
        );
      } else if (result.directUrl) {
        this.logger.log(`[IMPORT][${elapsed()}]   → Downloading from directUrl then re-uploading...`);
        const response = await fetch(result.directUrl);
        if (!response.ok || !response.body) {
          throw new Error('Không thể tải file từ public API');
        }
        uploadResult = await this.uploadFileService.uploadAudioFromStream(
          response.body as unknown as NodeJS.ReadableStream,
          'wio-audio-background',
          result.mimeType,
        );
      } else {
        throw new Error('Provider did not return audio stream, file or URL');
      }

      this.logger.log(`[IMPORT][${elapsed()}] Step 3/4: Upload complete.`);
      this.logger.log(`[IMPORT][${elapsed()}]   → fileUrl=${uploadResult.fileUrl}`);

      this.logger.log(`[IMPORT][${elapsed()}] Step 4/4: Updating DB record (status=COMPLETED)...`);
      music.audioUrl = uploadResult.fileUrl;
      
      if (result.info) {
        music.duration = result.info.durationText || music.duration;
        if (result.info.title && result.info.title !== 'YouTube Video' && result.info.title !== 'YouTube Audio') {
          music.name = result.info.title;
        }
        if (result.info.author && result.info.author !== 'Unknown') {
          music.author = result.info.author;
        }
      }
      
      music.status = enumData.MUSIC_PROCESS_STATUS.COMPLETED.code;
      music.isActive = true;

      const savedMusic = await this.musicRepo.save(music);
      this.logger.log(`[IMPORT][${elapsed()}] Step 4/4: Done! musicId=${savedMusic.id}`);
      this.logger.log(`[IMPORT SUCCESS] Total time: ${elapsed()} — "${music.name}"`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      return savedMusic;
    } catch (error: any) {
      this.logger.error(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      this.logger.error(`[IMPORT FAILED][${elapsed()}] ${error.message}`);
      this.logger.error(`[IMPORT FAILED] Stack: ${error.stack}`);
      this.logger.error(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      if (music) {
        music.status = enumData.MUSIC_PROCESS_STATUS.FAILED.code;
        music.isActive = false;
        await this.musicRepo.save(music).catch(() => null);
      }
      throw new Error(`Không thể tải video: ${error.message}`);
    }
  }

  async getYoutubeInfo(url: string, provider?: YoutubeAudioProviderType) {
    const videoId = this.extractYoutubeVideoId(url);
    if (!videoId) {
      throw new BadRequestException('Link YouTube không hợp lệ');
    }

    let title = 'YouTube Video';
    let author = 'Unknown';
    let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    let durationSeconds = 0;
    let durationText = '—';

    try {
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const res = await fetch(oEmbedUrl);
      if (res.ok) {
        const data = await res.json() as any;
        title = data.title || title;
        author = data.author_name || author;
        thumbnailUrl = data.thumbnail_url || thumbnailUrl;
      }
    } catch (e) {
      this.logger.warn(`oEmbed failed: ${e}`);
    }

    try {
      const lemnoUrl = `https://yt.lemnoslife.com/videos?part=contentDetails&id=${videoId}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(lemnoUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json() as any;
        const iso = data?.items?.[0]?.contentDetails?.duration;
        if (iso) {
          const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
          if (match) {
            const h = parseInt(match[1] || '0', 10);
            const m = parseInt(match[2] || '0', 10);
            const s = parseInt(match[3] || '0', 10);
            durationSeconds = h * 3600 + m * 60 + s;
            const totalMin = Math.floor(durationSeconds / 60);
            const secs = durationSeconds % 60;
            durationText = h > 0
              ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
              : `${totalMin}:${String(secs).padStart(2, '0')}`;
          }
        }
      }
    } catch (e) {
      this.logger.warn(`lemnoslife duration fetch failed: ${e}`);
    }

    if (durationSeconds === 0 || durationText === '—') {
      try {
        this.logger.log(`[INFO FALLBACK] Lemnoslife duration missing, falling back to python-yt-dlp info for: ${url}`);
        const info = await this.youtubeAudioService.getInfo(url, 'python-yt-dlp');
        if (info) {
          title = info.title || title;
          author = info.author || author;
          durationSeconds = info.durationSeconds || durationSeconds;
          durationText = info.durationText || durationText;
          thumbnailUrl = info.thumbnail || thumbnailUrl;
        }
      } catch (err: any) {
        this.logger.warn(`Fallback to python-yt-dlp info failed: ${err.message}`);
      }
    }

    return { id: videoId, title, author, durationSeconds, durationText, thumbnail: thumbnailUrl, thumbnailUrl, youtubeUrl: url };
  }

  async cancelImport(url: string) {
    this.logger.log(`[IMPORT CANCEL] Request to cancel import for: ${url}`);
    
    const music = await this.musicRepo.findOne({
      where: {
        youtubeUrl: url,
        status: enumData.MUSIC_PROCESS_STATUS.PROCESSING.code,
      },
    });

    if (music) {
      music.status = enumData.MUSIC_PROCESS_STATUS.FAILED.code;
      music.isActive = false;
      await this.musicRepo.save(music);
      this.logger.log(`[IMPORT CANCEL] Updated musicId ${music.id} status to FAILED`);
      return { success: true, message: 'Đã hủy tải bài hát' };
    }

    return { success: false, message: 'Không tìm thấy bài hát đang xử lý' };
  }

  private extractYoutubeVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) return match[1];
    }
    return null;
  }
}
