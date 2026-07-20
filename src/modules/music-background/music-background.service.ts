import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto } from '@/dto';
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

  async paginationActive(data?: PaginationDto<any>) {
    const { skip = 0, take = 10, where = {} } = data || {};
    const whereCon: FindOptionsWhere<any> = {
      isDeleted: false,
      isActive: true,
      status: enumData.MUSIC_PROCESS_STATUS.COMPLETED.code,
    };

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

  async create(createDto: CreateMusicBackgroundDto) {
    const music = this.musicRepo.create({
      ...createDto,
      status: enumData.MUSIC_PROCESS_STATUS.COMPLETED.code,
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

  async importYoutube(dto: ImportYoutubeDto) {
    const provider = dto.provider || 'youtube-dl-exec';
    const info = await this.youtubeAudioService.getInfo(
      dto.youtubeUrl,
      provider,
    );

    if (info.durationSeconds > 600) {
      throw new BadRequestException('Video quá dài (vượt quá 10 phút)');
    }

    const jobData = {
      youtubeUrl: dto.youtubeUrl,
      title: info.title,
      author: info.author,
      duration: info.durationText,
      provider,
    };

    try {
      await this.youtubeQueue.add('import', jobData, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
      });
      this.logger.log(
        `Enqueued youtube import job for: ${dto.youtubeUrl} (provider: ${provider})`,
      );
    } catch (queueError: any) {
      this.logger.warn(
        `Queue failed, falling back to background processing: ${queueError.message}`,
      );
      this.processYoutube(jobData).catch((err) => {
        this.logger.error(
          `Background youtube processing failed: ${err.message}`,
        );
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
  }) {
    let music: any = null;

    try {
      music = this.musicRepo.create({
        name: data.title,
        author: data.author,
        duration: data.duration,
        youtubeUrl: data.youtubeUrl,
        status: enumData.MUSIC_PROCESS_STATUS.PROCESSING.code,
        isActive: false,
        usageCount: 0,
      });
      await this.musicRepo.save(music);

      this.logger.log(
        `[${data.provider}] Downloading and uploading audio for musicId: ${music.id}`,
      );

      const result = await this.youtubeAudioService.downloadAudio(
        data.youtubeUrl,
        data.provider,
        { maxDurationSeconds: 600 },
      );

      let uploadResult: { fileName: string; fileUrl: string };

      if (result.stream) {
        uploadResult = await this.uploadFileService.uploadAudioFromStream(
          result.stream,
          'wio-audio-background',
          result.mimeType,
        );
      } else if (result.filePath) {
        uploadResult = await this.uploadFileService.uploadAudioFromFilePath(
          result.filePath,
          'wio-audio-background',
          result.mimeType,
        );
      } else if (result.directUrl) {
        // For public-api provider that returns a direct URL, we can either:
        // a) Save the direct URL directly (no upload)
        // b) Download then re-upload to our own storage
        // Option (b) is safer for long-term availability.
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

      music.audioUrl = uploadResult.fileUrl;
      music.status = enumData.MUSIC_PROCESS_STATUS.COMPLETED.code;
      music.isActive = true;

      const savedMusic = await this.musicRepo.save(music);
      this.logger.log(
        `Completed youtube download for musicId: ${savedMusic.id} via ${data.provider}`,
      );
      return savedMusic;
    } catch (error: any) {
      this.logger.error(`Failed to process youtube: ${error.message}`);
      if (music) {
        music.status = enumData.MUSIC_PROCESS_STATUS.FAILED.code;
        music.isActive = false;
        await this.musicRepo.save(music).catch(() => null);
      }
      throw new Error(`Không thể tải video: ${error.message}`);
    }
  }

  async getYoutubeInfo(url: string, provider?: YoutubeAudioProviderType) {
    return this.youtubeAudioService.getInfo(url, provider);
  }
}
