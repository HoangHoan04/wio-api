import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PromotionEntity } from './promotion.entity';
import { SubscriptionEntity } from './subscription.entity';
import { UserEntity } from './user.entity';

@Entity('transactions')
@Index(['providerRef'], {
  unique: true,
  where: `"providerRef" IS NOT NULL AND "isDeleted" = false`,
})
export class TransactionEntity extends BaseEntity {
  @ApiProperty({ description: 'ID user thực hiện giao dịch' })
  @Index()
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @ApiPropertyOptional({ description: 'ID thuê bao liên quan' })
  @Column({ type: 'uuid', nullable: true })
  subscriptionId?: string;

  @ApiPropertyOptional({ description: 'ID khuyến mãi áp dụng' })
  @Column({ type: 'uuid', nullable: true })
  promotionId?: string;

  @ApiProperty({ description: 'Số tiền giao dịch (VND)' })
  @Column({
    type: 'bigint',
    nullable: false,
    transformer: {
      to: (v: number) => v,
      from: (v: string) => Number(v),
    },
  })
  amountVnd: number;

  @ApiProperty({ description: 'Số tiền được giảm (VND)' })
  @Column({
    type: 'bigint',
    nullable: false,
    default: 0,
    transformer: {
      to: (v: number) => v,
      from: (v: string) => Number(v),
    },
  })
  discountVnd: number;

  @ApiProperty({
    description: 'Phương thức thanh toán',
    enum: enumData.TX_METHOD,
  })
  @Column({ type: 'varchar', length: 30, nullable: false })
  method: string;

  @ApiProperty({
    description: 'Trạng thái giao dịch',
    enum: enumData.TX_STATUS,
  })
  @Index()
  @Column({ type: 'varchar', length: 30, nullable: false })
  status: string;

  @ApiPropertyOptional({ description: 'Mã giao dịch từ provider' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  providerRef?: string;

  @ApiPropertyOptional({ description: 'Payload webhook thô từ provider' })
  @Column({ type: 'jsonb', nullable: true })
  rawPayload?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Thời điểm thanh toán thành công' })
  @Column({ type: 'timestamptz', nullable: true })
  paidAt?: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => SubscriptionEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'subscriptionId' })
  subscription?: SubscriptionEntity;

  @ManyToOne(() => PromotionEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'promotionId' })
  promotion?: PromotionEntity;
}
