import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SubStatus } from './enums';
import { ServicePlanEntity } from './service-plan.entity';
import { UserEntity } from './user.entity';
import { WeddingEntity } from './wedding.entity';

@Entity('subscriptions')
@Index(['status', 'expiresAt'])
export class SubscriptionEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID người dùng' })
  userId: string;

  // ID đám cưới
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID đám cưới' })
  weddingId: string;

  // Plan Id
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'Plan Id' })
  planId: string;

  // Trạng thái
  @Column({
    type: 'enum',
    enum: SubStatus,
    default: SubStatus.ACTIVE,
    nullable: false,
  })
  @ApiProperty({ description: 'Trạng thái' })
  status: SubStatus;

  // Started At
  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  @ApiProperty({ description: 'Started At' })
  startedAt: Date;

  // Ngày hết hạn
  @Column({ type: 'timestamptz', nullable: false })
  @ApiProperty({ description: 'Ngày hết hạn' })
  expiresAt: Date;

  // Paid Amount Vnd
  @Column({ type: 'bigint', nullable: true })
  @ApiProperty({ description: 'Paid Amount Vnd' })
  paidAmountVnd: number;

  // Payment Method
  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Payment Method' })
  paymentMethod: string;

  // Payment Ref
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Payment Ref' })
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
