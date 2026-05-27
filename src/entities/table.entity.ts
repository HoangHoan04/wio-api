import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

// Bàn ăn trong tiệc cưới - hỗ trợ sơ đồ kéo thả trên Admin Portal
@Entity('tables')
export class TableEntity extends BaseEntity {
  @ApiProperty({ description: 'ID Đám cưới' })
  @Column({ type: 'uuid', nullable: false })
  @Index()
  weddingId: string;

  @ApiProperty({ description: 'Tên bàn (Bàn 1, Bàn VIP...)' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({ description: 'Số chỗ tối đa' })
  @Column({ type: 'smallint', default: 10, nullable: false })
  maxSeats: number;

  @ApiProperty({ description: 'Số chỗ hiện tại' })
  @Column({ type: 'smallint', default: 0, nullable: false })
  currentSeats: number;

  @ApiProperty({ description: 'Mô tả', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @ApiProperty({
    description: 'Tọa độ X trên sơ đồ kéo thả (px)',
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  positionX: number;

  @ApiProperty({
    description: 'Tọa độ Y trên sơ đồ kéo thả (px)',
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  positionY: number;
}
