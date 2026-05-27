import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

// Album ảnh cưới - do cặp đôi upload qua Admin Portal
@Entity('wedding_photos')
export class WeddingPhotoEntity extends BaseEntity {
  @ApiProperty({ description: 'ID Đám cưới' })
  @Column({ type: 'uuid', nullable: false })
  @Index()
  weddingId: string;

  @ApiProperty({ description: 'Đường dẫn ảnh' })
  @Column({ type: 'text', nullable: false })
  url: string;

  @ApiProperty({ description: 'Key trên S3/Cloudinary', required: false })
  @Column({ type: 'varchar', length: 500, nullable: true })
  storageKey: string;

  @ApiProperty({ description: 'Chú thích ảnh', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  caption: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp' })
  @Column({ type: 'int', default: 0, nullable: false })
  sortOrder: number;
}
