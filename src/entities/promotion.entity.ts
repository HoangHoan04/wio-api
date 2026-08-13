import { enumData } from '@/common/constanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('promotions')
export class PromotionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  @ApiProperty({ description: 'Mã voucher' })
  code: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  @ApiProperty({ description: 'Tên' })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  @ApiProperty({ description: 'Loại giảm', enum: enumData.DISCOUNT_TYPE })
  discountType: string;

  @Column({ type: 'bigint', nullable: false })
  @ApiProperty({ description: 'Giá trị giảm' })
  discountValue: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ description: 'Số lượt tối đa', required: false })
  maxUses?: number;

  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({ description: 'Đã dùng' })
  usedCount: number;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Bắt đầu', required: false })
  startsAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Kết thúc', required: false })
  endsAt?: Date;

  @Column({ type: 'boolean', default: true, nullable: false })
  @ApiProperty({ description: 'Đang hoạt động' })
  isActive: boolean;
}
