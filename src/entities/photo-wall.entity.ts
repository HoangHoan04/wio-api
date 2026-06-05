import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WeddingEntity } from './wedding.entity';

@Entity('photo_wall')
@Index(['weddingId', 'isApproved'])
export class PhotoWallEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID đám cưới' })
  weddingId: string;

  // Guest Id
  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'Guest Id' })
  guestId: string;

  // Uploader Name
  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Uploader Name' })
  uploaderName: string;

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

  // Is Approved
  @Column({ type: 'boolean', default: true, nullable: false })
  @ApiProperty({ description: 'Is Approved' })
  isApproved: boolean;

  // Approved At
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Approved At' })
  approvedAt: Date;

  // Wedding
  @ManyToOne(() => WeddingEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'weddingId' })
  @ApiProperty({ description: 'Wedding' })
  wedding: WeddingEntity;
}
