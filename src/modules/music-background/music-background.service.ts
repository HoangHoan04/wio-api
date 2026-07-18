import { enumData } from '@/common/contanst/enumData';
import { IdDto, PaginationDto } from '@/dto';
import { MusicBackgroundRepository } from '@/repositories';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { FindOptionsWhere } from 'typeorm';
import youtubedl from 'youtube-dl-exec';
import {
  CreateMusicBackgroundDto,
  ImportYoutubeDto,
  UpdateMusicBackgroundDto,
} from './dto';

@Injectable()
export class MusicBackgroundService {
  private readonly logger = new Logger(MusicBackgroundService.name);

  constructor(private readonly musicRepo: MusicBackgroundRepository) {}

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
    const music = this.musicRepo.create({
      name: 'Đang tải thông tin...',
      author: 'Đang xử lý',
      duration: '0:00',
      youtubeUrl: dto.youtubeUrl,
      status: enumData.MUSIC_PROCESS_STATUS.PROCESSING.code,
      isActive: true,
    });

    const savedMusic = await this.musicRepo.save(music);

    try {
      this.logger.log(`Fetching youtube info for: ${dto.youtubeUrl}`);
      const info = (await youtubedl(dto.youtubeUrl, {
        dumpJson: true,
        noWarnings: true,
      })) as any;
      const title = info.title || 'Unknown Title';
      const author = info.uploader || 'Unknown Author';
      const lengthSeconds = parseInt(info.duration, 10) || 0;

      if (lengthSeconds > 600) {
        throw new Error('Video quá dài (vượt quá 10 phút)');
      }

      const minutes = Math.floor(lengthSeconds / 60);
      const seconds = lengthSeconds % 60;
      const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      await this.musicRepo.update(savedMusic.id, {
        name: title,
        author: author,
        duration: duration,
      });

      this.logger.log(`Downloading and piping to cloudinary...`);
      const uploadResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'video',
              folder: 'wio-audio-background',
              public_id: `yt_${savedMusic.id}`,
            },
            (error, result) => {
              if (error) {
                this.logger.error(`Cloudinary upload error: ${error.message}`);
                return reject(
                  new Error(`Cloudinary upload error: ${error.message}`),
                );
              }
              if (result) {
                this.logger.log(
                  `Cloudinary upload success: ${result.secure_url}`,
                );
                return resolve(result);
              }
            },
          );

          const subprocess = youtubedl.exec(
            dto.youtubeUrl,
            { output: '-', format: 'bestaudio' },
            { stdio: ['ignore', 'pipe', 'ignore'] },
          );

          if (!subprocess.stdout) {
            return reject(new Error('Failed to start youtube-dl-exec process'));
          }

          subprocess.stdout.on('error', (err: any) => {
            this.logger.error(`youtubedl error: ${err.message}`);
            reject(new Error(`youtubedl error: ${err.message}`));
          });

          subprocess.stdout.pipe(uploadStream);
        },
      );

      savedMusic.name = title;
      savedMusic.author = author;
      savedMusic.duration = duration;
      savedMusic.status = enumData.MUSIC_PROCESS_STATUS.COMPLETED.code;
      savedMusic.audioUrl = uploadResult.secure_url;

      await this.musicRepo.update(savedMusic.id, {
        status: enumData.MUSIC_PROCESS_STATUS.COMPLETED.code,
        audioUrl: uploadResult.secure_url,
      });

      this.logger.log(
        `Completed youtube download for musicId: ${savedMusic.id}`,
      );
      return savedMusic;
    } catch (error: any) {
      this.logger.error(`Failed to process youtube: ${error.message}`);
      await this.musicRepo.update(savedMusic.id, {
        status: enumData.MUSIC_PROCESS_STATUS.FAILED.code,
        name: `Lỗi: ${error.message}`,
      });
      throw new BadRequestException(`Không thể tải video: ${error.message}`);
    }
  }
}
