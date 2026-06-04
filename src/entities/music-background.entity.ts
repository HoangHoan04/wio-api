import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum MusicProcessStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('music_backgrounds')
export class MusicBackgroundEntity extends BaseEntity {
  @Column({ length: 255 })
  @ApiProperty({ description: 'Tên bài hát' })
  name: string;

  @Column({ length: 255, nullable: true })
  @ApiProperty({ description: 'Tác giả / Kênh Youtube', required: false })
  author: string;

  @Column({ length: 50, nullable: true })
  @ApiProperty({ description: 'Thời lượng (VD: 3:45)', required: false })
  duration: string;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Số lượt sử dụng' })
  usageCount: number;

  @Column({ default: true })
  @ApiProperty({ description: 'Trạng thái hoạt động' })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: MusicProcessStatus,
    default: MusicProcessStatus.COMPLETED,
  })
  @ApiProperty({ description: 'Trạng thái xử lý file âm thanh', enum: MusicProcessStatus })
  status: MusicProcessStatus;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Link gốc Youtube (nếu có)', required: false })
  youtubeUrl: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'URL trực tiếp đến file mp3 trên Cloudinary', required: false })
  audioUrl: string;
}
