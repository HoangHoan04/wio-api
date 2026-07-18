import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WeddingEntity } from './wedding.entity';

@Entity('wedding_events')
export class WeddingEventEntity extends BaseEntity {
  // ID đám cưới
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID đám cưới' })
  weddingId: string;

  // Tiêu đề
  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Tiêu đề' })
  title: string;

  // Ngày
  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Ngày' })
  date?: string;

  // Thời gian
  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Thời gian' })
  time?: string;

  // Địa chỉ
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Địa chỉ' })
  address?: string;

  // Thứ tự sắp xếp
  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({ description: 'Thứ tự sắp xếp' })
  sortOrder: number;

  // Wedding
  @ManyToOne(() => WeddingEntity, (wedding) => wedding.events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'weddingId' })
  @ApiProperty({ description: 'Wedding' })
  wedding: WeddingEntity;
}
