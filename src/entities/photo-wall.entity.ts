import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

// Ảnh do khách chụp tại tiệc và upload - Wedding Photo Wall
@Entity('photo_wall')
@Index(['weddingId', 'isApproved'])
export class PhotoWallEntity extends BaseEntity {
  @ApiProperty({ description: 'ID Đám cưới' })
  @Column({ type: 'uuid', nullable: false })
  weddingId: string;

  @ApiProperty({
    description: 'ID Khách mời (Null nếu upload ẩn danh)',
    required: false,
  })
  @Column({ type: 'uuid', nullable: true })
  guestId: string;

  @ApiProperty({ description: 'Tên người upload' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  uploaderName: string;

  @ApiProperty({ description: 'Đường dẫn ảnh' })
  @Column({ type: 'text', nullable: false })
  url: string;

  @ApiProperty({ description: 'Key lưu trữ', required: false })
  @Column({ type: 'varchar', length: 500, nullable: true })
  storageKey: string;

  @ApiProperty({ description: 'Chú thích ảnh', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  caption: string;

  @ApiProperty({ description: 'Đã duyệt?' })
  @Column({ type: 'boolean', default: true, nullable: false })
  isApproved: boolean;

  @ApiProperty({ description: 'Thời gian duyệt', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  approvedAt: Date;
}
