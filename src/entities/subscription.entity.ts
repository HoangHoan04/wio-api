import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SubStatus } from './enums';

// Gói dịch vụ đã đăng ký - liên kết user, wedding và plan
@Entity('subscriptions')
@Index(['status', 'expiresAt'])
export class SubscriptionEntity extends BaseEntity {
  @ApiProperty({ description: 'ID User đăng ký' })
  @Column({ type: 'uuid', nullable: false })
  @Index()
  userId: string;

  @ApiProperty({ description: 'ID Đám cưới sử dụng gói' })
  @Column({ type: 'uuid', nullable: false })
  @Index()
  weddingId: string;

  @ApiProperty({ description: 'ID Gói dịch vụ' })
  @Column({ type: 'uuid', nullable: false })
  planId: string;

  @ApiProperty({ description: 'Trạng thái gói', enum: SubStatus })
  @Column({
    type: 'enum',
    enum: SubStatus,
    default: SubStatus.ACTIVE,
    nullable: false,
  })
  status: SubStatus;

  @ApiProperty({ description: 'Ngày bắt đầu' })
  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  startedAt: Date;

  @ApiProperty({ description: 'Ngày hết hạn' })
  @Column({ type: 'timestamptz', nullable: false })
  expiresAt: Date;

  @ApiProperty({ description: 'Số tiền đã thanh toán', required: false })
  @Column({ type: 'bigint', nullable: true })
  paidAmountVnd: number;

  @ApiProperty({ description: 'Phương thức thanh toán', required: false })
  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentMethod: string;

  @ApiProperty({ description: 'Mã giao dịch', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentRef: string;
}
