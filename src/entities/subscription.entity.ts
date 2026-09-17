import { enumData } from '@/common/constanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ServicePlanEntity } from './service-plan.entity';
import { UserEntity } from './user.entity';

@Entity('subscriptions')
@Index(['status', 'expiresAt'])
@Index(['userId', 'status'])
export class SubscriptionEntity extends BaseEntity {
  @ApiProperty({ description: 'ID user đăng ký gói' })
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @ApiProperty({ description: 'ID gói dịch vụ' })
  @Column({ type: 'uuid', nullable: false })
  planId: string;

  @ApiProperty({
    description: 'Trạng thái thuê bao',
    enum: enumData.SUB_STATUS,
  })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: enumData.SUB_STATUS.ACTIVE.code,
  })
  status: string;

  @ApiProperty({ description: 'Thời điểm bắt đầu thuê bao' })
  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  startedAt: Date;

  @ApiProperty({ description: 'Thời điểm hết hạn thuê bao' })
  @Column({ type: 'timestamptz', nullable: false })
  expiresAt: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => ServicePlanEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'planId' })
  plan: ServicePlanEntity;
}
