import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WeddingEntity } from './wedding.entity';

@Entity('photo_wall')
@Index(['weddingId', 'isApproved'])
export class PhotoWallEntity extends BaseEntity {
  // ID đám cưới
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID đám cưới' })
  weddingId: string;

  // Id khách mời
  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'Id khách mời' })
  guestId?: string;

  // Tên người tải lên
  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Tên người tải lên' })
  uploaderName: string;

  // Đường dẫn URL
  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'Đường dẫn URL' })
  url: string;

  // Khoá lưu trữ (Storage Key)
  @Column({ type: 'varchar', length: 500, nullable: true })
  @ApiProperty({ description: 'Khoá lưu trữ (Storage Key)' })
  storageKey?: string;

  // Caption
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Caption' })
  caption?: string;

  // Có được duyệt không
  @Column({ type: 'boolean', default: true, nullable: false })
  @ApiProperty({ description: 'Có được duyệt không' })
  isApproved: boolean;

  // Ngày duyệt
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày duyệt ' })
  approvedAt?: Date;

  @ManyToOne(() => WeddingEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'weddingId' })
  @ApiProperty({ description: 'Wedding' })
  wedding: WeddingEntity;
}
