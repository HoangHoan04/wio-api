import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('invitation_timelines')
@Index(['invitationId', 'sortOrder'])
export class InvitationTimelineEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @Column({ type: 'uuid', nullable: false })
  invitationId: string;

  @ApiPropertyOptional({ description: 'ID sự kiện cưới liên kết' })
  @Column({ type: 'uuid', nullable: true })
  eventId?: string;

  @ApiPropertyOptional({
    description: 'Nhãn thời gian hiển thị (VD: 08:00, 10:30…)',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  timeLabel?: string;

  @ApiProperty({ description: 'Tiêu đề mốc lịch trình' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @ApiPropertyOptional({ description: 'Mô tả chi tiết mốc lịch trình' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiPropertyOptional({ description: 'URL icon hiển thị' })
  @Column({ type: 'text', nullable: true })
  iconUrl?: string;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  @Column({ type: 'int', default: 0, nullable: false })
  sortOrder: number;

  @ManyToOne(() => InvitationEntity, (i) => i.timelines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;
}
