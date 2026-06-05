import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WeddingEntity } from './wedding.entity';

@Entity('guest_groups')
export class GuestGroupEntity extends BaseEntity {
  // ID đám cưới
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID đám cưới' })
  weddingId: string;

  // Tên
  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Tên' })
  name: string;

  // Màu sắc nhãn
  @Column({ type: 'varchar', length: 7, nullable: true })
  @ApiProperty({ description: 'Màu sắc nhãn' })
  colorLabel: string;

  // Mô tả
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Mô tả' })
  description: string;

  // Thứ tự sắp xếp
  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({ description: 'Thứ tự sắp xếp' })
  sortOrder: number;

  // Wedding
  @ManyToOne(() => WeddingEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'weddingId' })
  @ApiProperty({ description: 'Wedding' })
  wedding: WeddingEntity;
}
