import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('promotions')
@Index(['code'], { unique: true, where: `"isDeleted" = false` })
export class PromotionEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã voucher khuyến mãi' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  code: string;

  @ApiProperty({ description: 'Tên chương trình khuyến mãi' })
  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @ApiProperty({ description: 'Loại giảm giá', enum: enumData.DISCOUNT_TYPE })
  @Column({ type: 'varchar', length: 20, nullable: false })
  discountType: string;

  @ApiProperty({ description: 'Giá trị giảm (số tiền VND hoặc %)' })
  @Column({
    type: 'bigint',
    nullable: false,
    transformer: {
      to: (v: number) => v,
      from: (v: string) => Number(v),
    },
  })
  discountValue: number;

  @ApiPropertyOptional({ description: 'Giá trị đơn hàng tối thiểu (VND)' })
  @Column({
    type: 'bigint',
    nullable: true,
    transformer: {
      to: (v: number) => v,
      from: (v: string) => (v === null ? null : Number(v)),
    },
  })
  minOrderVnd?: number;

  @ApiPropertyOptional({ description: 'Số lượt sử dụng tối đa' })
  @Column({ type: 'int', nullable: true })
  maxUses?: number;

  @ApiProperty({ description: 'Số lượt đã sử dụng' })
  @Column({ type: 'int', default: 0, nullable: false })
  usedCount: number;

  @ApiPropertyOptional({ description: 'Thời điểm bắt đầu áp dụng' })
  @Column({ type: 'timestamptz', nullable: true })
  startsAt?: Date;

  @ApiPropertyOptional({ description: 'Thời điểm kết thúc áp dụng' })
  @Column({ type: 'timestamptz', nullable: true })
  endsAt?: Date;

  @ApiProperty({ description: 'Trạng thái hoạt động' })
  @Column({ type: 'boolean', default: true, nullable: false })
  isActive: boolean;
}
