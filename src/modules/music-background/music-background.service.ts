import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { MusicBackgroundEntity } from '@/entities';
import { MusicBackgroundRepository } from '@/repositories';
import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UploadFileService } from '../upload-file/upload-file.service';
import { YoutubeAudioService } from '../youtube-audio';
import {
  DEFAULT_YOUTUBE_PROVIDER,
  MAX_YOUTUBE_DURATION_SECONDS,
  MUSIC_AUDIO_BUCKET,
  QUEUE_TIMEOUT_MS,
  YOUTUBE_IMPORT_JOB,
  YOUTUBE_IMPORT_QUEUE,
  YoutubeProvider,
} from './constants/music-background.constant';
import {
  CancelImportDto,
  CreateMusicBackgroundDto,
  FilterMusicBackgroundDto,
  GetYoutubeInfoDto,
  ImportYoutubeDto,
  UpdateMusicBackgroundDto,
} from './dto';
import {
  extractYoutubeVideoId,
  normalizeYoutubeUrl,
} from './utils/youtube-url.util';

/* ============================================================
 * JOB DATA
 * ============================================================ */
export type YoutubeJobData = {
  youtubeUrl: string;
  title: string;
  author: string;
  duration: string;
  provider: YoutubeProvider;
  userId?: string;
  type: string;
};

@Injectable()
export class MusicBackgroundService {
  private readonly logger = new Logger(MusicBackgroundService.name);

  constructor(
    private readonly musicRepo: MusicBackgroundRepository,
    private readonly uploadFileService: UploadFileService,
    private readonly youtubeAudioService: YoutubeAudioService,
    private readonly configService: ConfigService,
    @InjectQueue(YOUTUBE_IMPORT_QUEUE) private readonly youtubeQueue: Queue,
  ) {}

  /* ============================================================
   * PAGINATION — Public (chỉ nhạc READY + active)
   * ============================================================ */
  async paginationActive(
    data: PaginationDto<FilterMusicBackgroundDto> = {},
    user?: UserDto,
  ) {
    const { skip = 0, take = 10, where = {} } = data;

    const whereCon: FindOptionsWhere<MusicBackgroundEntity> = {
      isDeleted: false,
      isActive: true,
      status: enumData.MUSIC_STATUS.READY.code,
    };

    // User chỉ thấy nhạc ADMIN + nhạc USER của chính mình
    if (where.type === enumData.MUSIC_TYPE.USER.code && user) {
      whereCon.type = enumData.MUSIC_TYPE.USER.code;
      whereCon.createdBy = user.id;
    } else {
      whereCon.type = enumData.MUSIC_TYPE.ADMIN.code;
    }

    const [list, total] = await this.musicRepo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  /* ============================================================
   * PAGINATION — Admin (xem hết)
   * ============================================================ */
  async pagination(data: PaginationDto<FilterMusicBackgroundDto>) {
    const { skip = 0, take = 10, where = {} } = data;

    const whereCon: FindOptionsWhere<MusicBackgroundEntity> = {
      isDeleted: false,
    };

    if (where.name) whereCon.name = ILike(`%${where.name}%`);
    if (where.author) whereCon.author = ILike(`%${where.author}%`);
    if (where.isActive !== undefined) whereCon.isActive = where.isActive;
    if (where.status) whereCon.status = where.status;
    if (where.type) whereCon.type = where.type;

    const [list, total] = await this.musicRepo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  /* ============================================================
   * FIND BY ID
   * ============================================================ */
  async findById(id: string) {
    const music = await this.musicRepo.findOne({
      where: { id, isDeleted: false },
    });
    if (!music) throw new NotFoundException('Không tìm thấy nhạc nền');
    return { message: 'Thành công', data: music };
  }

  /* ============================================================
   * CREATE — user tự upload
   * ============================================================ */
  async create(dto: CreateMusicBackgroundDto, user?: UserDto) {
    // Nếu có audioUrl → READY, ngược lại PENDING
    const status = dto.audioUrl
      ? enumData.MUSIC_STATUS.READY.code
      : enumData.MUSIC_STATUS.PENDING.code;

    const music = this.musicRepo.create({
      ...dto,
      id: uuidv4(),
      status,
      isActive: dto.isActive ?? !!dto.audioUrl,
      createdBy: user?.id,
    });

    const saved = await this.musicRepo.save(music);
    return { message: 'Tạo nhạc nền thành công', data: saved };
  }

  /* ============================================================
   * UPDATE
   * ============================================================ */
  async update(dto: UpdateMusicBackgroundDto, user?: UserDto) {
    const { id, ...rest } = dto;

    const music = await this.musicRepo.findOne({
      where: { id, isDeleted: false },
    });
    if (!music) throw new NotFoundException('Không tìm thấy nhạc nền');

    Object.assign(music, rest);
    music.updatedBy = user?.id;

    const saved = await this.musicRepo.save(music);
    return { message: 'Cập nhật nhạc nền thành công', data: saved };
  }

  /* ============================================================
   * DELETE (soft)
   * ============================================================ */
  async remove(id: string, user?: UserDto) {
    const music = await this.musicRepo.findOne({
      where: { id, isDeleted: false },
    });
    if (!music) throw new NotFoundException('Không tìm thấy nhạc nền');

    music.isDeleted = true;
    music.updatedBy = user?.id;
    await this.musicRepo.save(music);

    return { message: 'Xoá nhạc nền thành công' };
  }

  /* ============================================================
   * INCREMENT USAGE (atomic)
   * ============================================================ */
  async incrementUsage(data: IdDto) {
    const music = await this.musicRepo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!music) throw new NotFoundException('Không tìm thấy nhạc nền');

    await this.musicRepo.increment({ id: data.id }, 'usageCount', 1);

    return { message: 'Đã tăng lượt sử dụng' };
  }

  /* ============================================================
   * IMPORT YOUTUBE (queue + fallback)
   * ============================================================ */
  async importYoutube(dto: ImportYoutubeDto, user?: UserDto) {
    const youtubeUrl = normalizeYoutubeUrl(dto.youtubeUrl);
    const provider =
      dto.provider ||
      this.configService.get<YoutubeProvider>('YOUTUBE_AUDIO_PROVIDER') ||
      DEFAULT_YOUTUBE_PROVIDER;

    const videoId = extractYoutubeVideoId(youtubeUrl);
    if (!videoId) {
      throw new BadRequestException('Link YouTube không hợp lệ');
    }

    // Metadata nhanh từ oEmbed
    let title = 'YouTube Audio';
    let author = 'Unknown';

    try {
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const res = await fetch(oEmbedUrl);
      if (res.ok) {
        const data = await res.json();
        title = data.title || title;
        author = data.author_name || author;
      }
    } catch (e) {
      this.logger.warn(`oEmbed failed: ${e}`);
    }

    const jobData: YoutubeJobData = {
      youtubeUrl,
      title,
      author,
      duration: '—',
      provider,
      userId: user?.id,
      type:
        dto.type ||
        (user ? enumData.MUSIC_TYPE.USER.code : enumData.MUSIC_TYPE.ADMIN.code),
    };

    this.logger.log(`[IMPORT] Enqueue job (provider=${provider})...`);

    try {
      await Promise.race([
        this.youtubeQueue.add(YOUTUBE_IMPORT_JOB, jobData, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error('Queue timeout — Redis unavailable')),
            QUEUE_TIMEOUT_MS,
          ),
        ),
      ]);
      this.logger.log(`[IMPORT] Enqueued. URL=${youtubeUrl}`);
    } catch (queueError: any) {
      this.logger.warn(
        `[IMPORT] Queue unavailable (${queueError.message}), chạy nền...`,
      );

      setImmediate(() => {
        this.processYoutube(jobData).catch((err) => {
          this.logger.error(`[IMPORT] Background failed: ${err.message}`);
        });
      });
    }

    return { message: 'Đã thêm vào hàng đợi xử lý', provider };
  }

  /* ============================================================
   * PROCESS YOUTUBE
   * ============================================================ */
  async processYoutube(data: YoutubeJobData) {
    let music: MusicBackgroundEntity | null = null;
    const startTime = Date.now();
    const elapsed = () => `${((Date.now() - startTime) / 1000).toFixed(1)}s`;

    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    this.logger.log(`[IMPORT START] provider=${data.provider}`);
    this.logger.log(`[IMPORT] URL: ${data.youtubeUrl}`);
    this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    try {
      // Step 1 — Tạo record PROCESSING
      this.logger.log(`[IMPORT][${elapsed()}] Step 1/4: Saving DB record...`);
      music = this.musicRepo.create({
        id: uuidv4(),
        name: data.title,
        author: data.author,
        duration: data.duration,
        youtubeUrl: data.youtubeUrl,
        status: enumData.MUSIC_STATUS.PROCESSING.code,
        isActive: false,
        usageCount: 0,
        type: data.type,
        createdBy: data.userId,
      });
      await this.musicRepo.save(music);
      this.logger.log(`[IMPORT][${elapsed()}] Step 1/4: musicId=${music.id}`);

      // Step 2 — Download audio
      this.logger.log(`[IMPORT][${elapsed()}] Step 2/4: Downloading...`);
      const result = await this.youtubeAudioService.downloadAudio(
        data.youtubeUrl,
        data.provider,
        { maxDurationSeconds: MAX_YOUTUBE_DURATION_SECONDS },
      );

      // Step 3 — Upload
      this.logger.log(`[IMPORT][${elapsed()}] Step 3/4: Uploading...`);
      let uploadResult: { fileName: string; fileUrl: string };

      if (result.stream) {
        uploadResult = await this.uploadFileService.uploadAudioFromStream(
          result.stream,
          MUSIC_AUDIO_BUCKET,
          result.mimeType,
        );
      } else if (result.filePath) {
        uploadResult = await this.uploadFileService.uploadAudioFromFilePath(
          result.filePath,
          MUSIC_AUDIO_BUCKET,
          result.mimeType,
        );
      } else if (result.directUrl) {
        const response = await fetch(result.directUrl);
        if (!response.ok || !response.body) {
          throw new Error('Không thể tải file từ public API');
        }
        uploadResult = await this.uploadFileService.uploadAudioFromStream(
          response.body as unknown as NodeJS.ReadableStream,
          MUSIC_AUDIO_BUCKET,
          result.mimeType,
        );
      } else {
        throw new Error('Provider không trả stream/file/URL');
      }

      // Step 4 — Update record
      this.logger.log(`[IMPORT][${elapsed()}] Step 4/4: Updating DB...`);
      music.audioUrl = uploadResult.fileUrl;

      if (result.info) {
        if (result.info.durationText) music.duration = result.info.durationText;
        if (
          result.info.title &&
          !['YouTube Video', 'YouTube Audio'].includes(result.info.title)
        ) {
          music.name = result.info.title;
        }
        if (result.info.author && result.info.author !== 'Unknown') {
          music.author = result.info.author;
        }
      }

      music.status = enumData.MUSIC_STATUS.READY.code;
      music.isActive = true;

      const saved = await this.musicRepo.save(music);
      this.logger.log(`[IMPORT SUCCESS] ${elapsed()} — "${saved.name}"`);
      return saved;
    } catch (error: any) {
      this.logger.error(`[IMPORT FAILED][${elapsed()}] ${error.message}`);

      if (music) {
        music.status = enumData.MUSIC_STATUS.FAILED.code;
        music.isActive = false;
        await this.musicRepo.save(music).catch(() => null);
      }
      throw new Error(`Không thể tải video: ${error.message}`);
    }
  }

  /* ============================================================
   * GET YOUTUBE INFO
   * ============================================================ */
  async getYoutubeInfo(dto: GetYoutubeInfoDto) {
    const normalizedUrl = normalizeYoutubeUrl(dto.url);
    const videoId = extractYoutubeVideoId(normalizedUrl);
    if (!videoId) throw new BadRequestException('Link YouTube không hợp lệ');

    let title = 'YouTube Video';
    let author = 'Unknown';
    let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    let durationSeconds = 0;
    let durationText = '—';

    // ---- oEmbed ----
    try {
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const res = await fetch(oEmbedUrl);
      if (res.ok) {
        const data = await res.json();
        title = data.title || title;
        author = data.author_name || author;
        thumbnailUrl = data.thumbnail_url || thumbnailUrl;
      }
    } catch (e) {
      this.logger.warn(`oEmbed failed: ${e}`);
    }

    // ---- Duration từ lemnoslife (public API) ----
    try {
      const lemnoUrl = `https://yt.lemnoslife.com/videos?part=contentDetails&id=${videoId}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(lemnoUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const iso = data?.items?.[0]?.contentDetails?.duration;
        if (iso) {
          const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
          if (match) {
            const h = parseInt(match[1] || '0', 10);
            const m = parseInt(match[2] || '0', 10);
            const s = parseInt(match[3] || '0', 10);
            durationSeconds = h * 3600 + m * 60 + s;

            durationText =
              h > 0
                ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
                : `${Math.floor(durationSeconds / 60)}:${String(durationSeconds % 60).padStart(2, '0')}`;
          }
        }
      }
    } catch (e) {
      this.logger.warn(`lemnoslife duration fetch failed: ${e}`);
    }

    // ---- Fallback qua yt-dlp nếu thiếu duration ----
    if (durationSeconds === 0 || durationText === '—') {
      try {
        this.logger.log(`[INFO FALLBACK] Python yt-dlp for: ${normalizedUrl}`);
        const info = await this.youtubeAudioService.getInfo(
          normalizedUrl,
          dto.provider || 'python-yt-dlp',
        );
        if (info) {
          title = info.title || title;
          author = info.author || author;
          durationSeconds = info.durationSeconds || durationSeconds;
          durationText = info.durationText || durationText;
          thumbnailUrl = info.thumbnail || thumbnailUrl;
        }
      } catch (err: any) {
        this.logger.warn(`yt-dlp info fallback failed: ${err.message}`);
      }
    }

    return {
      id: videoId,
      title,
      author,
      durationSeconds,
      durationText,
      thumbnail: thumbnailUrl,
      thumbnailUrl,
      youtubeUrl: normalizedUrl,
    };
  }

  /* ============================================================
   * CANCEL IMPORT
   * ============================================================ */
  async cancelImport(dto: CancelImportDto) {
    const normalizedUrl = normalizeYoutubeUrl(dto.url);
    this.logger.log(`[IMPORT CANCEL] Request: ${normalizedUrl}`);

    const music = await this.musicRepo.findOne({
      where: [
        {
          youtubeUrl: normalizedUrl,
          status: enumData.MUSIC_STATUS.PROCESSING.code,
        },
        {
          youtubeUrl: dto.url,
          status: enumData.MUSIC_STATUS.PROCESSING.code,
        },
      ],
    });

    if (!music) {
      return { success: false, message: 'Không tìm thấy bài hát đang xử lý' };
    }

    music.status = enumData.MUSIC_STATUS.FAILED.code;
    music.isActive = false;
    await this.musicRepo.save(music);

    this.logger.log(`[IMPORT CANCEL] musicId=${music.id} → FAILED`);
    return { success: true, message: 'Đã huỷ tải bài hát' };
  }
}
