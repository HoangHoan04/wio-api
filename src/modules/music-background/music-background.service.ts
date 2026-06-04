import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MusicProcessStatus } from '@/entities/music-background.entity';
import { CreateMusicBackgroundDto, UpdateMusicBackgroundDto, ImportYoutubeDto } from './dto';
import { MusicBackgroundRepository } from '@/repositories';
import { IdDto, PaginationDto } from '@/dto';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class MusicBackgroundService {
  constructor(
    private readonly musicRepo: MusicBackgroundRepository,
    @InjectQueue('music-queue') private readonly musicQueue: Queue,
  ) {}



  async paginationActive(data: PaginationDto<any>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<any> = { isDeleted: false, isActive: true, status: MusicProcessStatus.COMPLETED };


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
      status: MusicProcessStatus.COMPLETED,
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
      status: MusicProcessStatus.PENDING,
      isActive: true,
    });

    const savedMusic = await this.musicRepo.save(music);

    await this.musicQueue.add('download-youtube', {
      musicId: savedMusic.id,
      youtubeUrl: dto.youtubeUrl,
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });

    return savedMusic;
  }
}
