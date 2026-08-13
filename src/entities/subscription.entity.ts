import { enumData } from '@/common/constanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ServicePlanEntity } from './service-plan.entity';
import { UserEntity } from './user.entity';

@Entity('subscriptions')
@Index(['status', 'expiresAt'])
export class SubscriptionEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID người dùng' })
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'Plan Id' })
  planId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Trạng thái', enum: enumData.SUB_STATUS })
  status: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  @ApiProperty({ description: 'Ngày bắt đầu' })
  startedAt: Date;

  @Column({ type: 'timestamptz', nullable: false })
  @ApiProperty({ description: 'Ngày hết hạn' })
  expiresAt: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => ServicePlanEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'planId' })
  plan: ServicePlanEntity;
}
