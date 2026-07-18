import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ServicePlanEntity } from './service-plan.entity';
import { UserEntity } from './user.entity';
import { WeddingEntity } from './wedding.entity';

@Entity('subscriptions')
@Index(['status', 'expiresAt'])
export class SubscriptionEntity extends BaseEntity {
  // ID người dùng
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID người dùng' })
  userId: string;

  // ID đám cưới
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID đám cưới' })
  weddingId: string;

  // ID gói dịch vụ
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'Plan Id' })
  planId: string;

  // Trạng thái
  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Trạng thái' })
  status: string;

  // Ngày bắt đầu
  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  @ApiProperty({ description: 'Ngày bắt đầu' })
  startedAt: Date;

  // Ngày hết hạn
  @Column({ type: 'timestamptz', nullable: false })
  @ApiProperty({ description: 'Ngày hết hạn' })
  expiresAt: Date;

  // Số tiền đã thanh toán
  @Column({ type: 'bigint', nullable: true })
  @ApiProperty({ description: 'Số tiền đã thanh toán' })
  paidAmountVnd: number;

  // Phương thức thanh toán
  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Phương thức thanh toán' })
  paymentMethod: string;

  // Tham chiếu thanh toán
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Tham chiếu thanh toán' })
  paymentRef: string;

  // User
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @ApiProperty({ description: 'User' })
  user: UserEntity;

  // Wedding
  @ManyToOne(() => WeddingEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'weddingId' })
  @ApiProperty({ description: 'Wedding' })
  wedding: WeddingEntity;

  // Plan
  @ManyToOne(() => ServicePlanEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'planId' })
  @ApiProperty({ description: 'Plan' })
  plan: ServicePlanEntity;
}
