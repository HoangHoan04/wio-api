import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WeddingEntity } from './wedding.entity';

@Entity('slug_history')
export class SlugHistoryEntity extends BaseEntity {
  // ID đám cưới
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID đám cưới' })
  weddingId: string;

  // Đường dẫn cũ
  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Đường dẫn cũ' })
  oldSlug: string;

  // Đường dẫn mới
  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Đường dẫn mới' })
  newSlug: string;

  // Người thay đổi
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'Người thay đổi' })
  changedBy: string;

  // Lý do
  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'Lý do' })
  reason: string;

  // Wedding
  @ManyToOne(() => WeddingEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'weddingId' })
  @ApiProperty({ description: 'Wedding' })
  wedding: WeddingEntity;
}
