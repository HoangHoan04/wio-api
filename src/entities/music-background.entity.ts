import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('music_backgrounds')
@Index(['isActive', 'type'])
export class MusicBackgroundEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên bài nhạc nền' })
  @Column({ length: 255 })
  name: string;

  @ApiPropertyOptional({ description: 'Tác giả / kênh YouTube' })
  @Column({ length: 255, nullable: true })
  author?: string;

  @ApiPropertyOptional({ description: 'Thời lượng bài nhạc (VD: 3:45)' })
  @Column({ length: 50, nullable: true })
  duration?: string;

  @ApiProperty({ description: 'Số lượt sử dụng' })
  @Column({ default: 0 })
  usageCount: number;

  @ApiProperty({ description: 'Trạng thái hoạt động' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Trạng thái xử lý file âm thanh',
    enum: enumData.MUSIC_STATUS,
  })
  @Column({ type: 'varchar', length: 20, nullable: false })
  status: string;

  @ApiPropertyOptional({ description: 'Link gốc YouTube (nếu có)' })
  @Column({ type: 'text', nullable: true })
  youtubeUrl?: string;

  @ApiPropertyOptional({ description: 'URL file âm thanh trực tiếp' })
  @Column({ type: 'text', nullable: true })
  audioUrl?: string;

  @ApiPropertyOptional({ description: 'URL ảnh thumbnail' })
  @Column({ type: 'text', nullable: true })
  thumbnailUrl?: string;

  @ApiProperty({ description: 'Nguồn nhạc', enum: enumData.MUSIC_TYPE })
  @Column({
    type: 'varchar',
    length: 20,
    default: enumData.MUSIC_TYPE.UPLOAD.code,
  })
  type: string;
}
