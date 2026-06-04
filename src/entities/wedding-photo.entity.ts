import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { WeddingEntity } from './wedding.entity';
import { BaseEntity } from './base.entity';

// ==================== WEDDING PHOTOS ====================
@Entity('wedding_photos')
export class WeddingPhotoEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID đám cưới' })
  weddingId: string;

  // Đường dẫn URL
  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'Đường dẫn URL' })
  url: string;

  // Storage Key
  @Column({ type: 'varchar', length: 500, nullable: true })
  @ApiProperty({ description: 'Storage Key' })
  storageKey: string;

  // Caption
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Caption' })
  caption: string;

  // Thứ tự sắp xếp
  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({ description: 'Thứ tự sắp xếp' })
  sortOrder: number;

  // Wedding
  @ManyToOne(() => WeddingEntity, (wedding) => wedding.photos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'weddingId' })
  @ApiProperty({ description: 'Wedding' })
  wedding: WeddingEntity;
}
