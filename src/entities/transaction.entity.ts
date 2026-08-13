import { enumData } from '@/common/constanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PromotionEntity } from './promotion.entity';
import { SubscriptionEntity } from './subscription.entity';
import { UserEntity } from './user.entity';

@Entity('transactions')
@Index(['providerRef'], { unique: true, where: `"providerRef" IS NOT NULL AND "isDeleted" = false` })
export class TransactionEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @Index()
  @ApiProperty({ description: 'ID người dùng' })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'ID thuê bao', required: false })
  subscriptionId?: string;

  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'ID khuyến mãi', required: false })
  promotionId?: string;

  @Column({ type: 'bigint', nullable: false })
  @ApiProperty({ description: 'Số tiền VND' })
  amountVnd: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  @ApiProperty({ description: 'Cổng thanh toán', enum: enumData.TX_METHOD })
  method: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  @Index()
  @ApiProperty({ description: 'Trạng thái', enum: enumData.TX_STATUS })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Mã giao dịch provider', required: false })
  providerRef?: string;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Payload webhook', required: false })
  rawPayload?: Record<string, any>;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Thời điểm thanh toán', required: false })
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
