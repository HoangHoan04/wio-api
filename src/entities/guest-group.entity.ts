import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

// Nhóm phân loại khách mời - tự định nghĩa theo từng đám cưới
@Entity('guest_groups')
export class GuestGroupEntity extends BaseEntity {
  @ApiProperty({ description: 'ID Đám cưới' })
  @Column({ type: 'uuid', nullable: false })
  @Index()
  weddingId: string;

  @ApiProperty({ description: 'Tên nhóm (Họ hàng, Bạn thân...)' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Mã màu HEX để hiển thị trên UI',
    required: false,
  })
  @Column({ type: 'varchar', length: 7, nullable: true })
  colorLabel: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp' })
  @Column({ type: 'int', default: 0, nullable: false })
  sortOrder: number;
}
