import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { WeddingEntity } from './wedding.entity';
import { BaseEntity } from './base.entity';

@Entity('wedding_timelines')
export class WeddingTimelineEntity extends BaseEntity {
  // ID đám cưới
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID đám cưới' })
  weddingId: string;

  // Thời gian
  @Column({ type: 'varchar', length: 50, nullable: false })
  @ApiProperty({ description: 'Thời gian' })
  time: string;

  // Tiêu đề
  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Tiêu đề' })
  title: string;

  // Thứ tự sắp xếp
  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({ description: 'Thứ tự sắp xếp' })
  sortOrder: number;

  // Wedding
  @ManyToOne(() => WeddingEntity, (wedding) => wedding.timelines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'weddingId' })
  @ApiProperty({ description: 'Wedding' })
  wedding: WeddingEntity;
}
