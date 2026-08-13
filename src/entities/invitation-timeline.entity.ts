import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('invitation_timelines')
export class InvitationTimelineEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID thiệp' })
  invitationId: string;

  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'ID sự kiện', required: false })
  eventId?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Nhãn giờ', required: false })
  timeLabel?: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Tiêu đề' })
  title: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Mô tả', required: false })
  description?: string;

  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({ description: 'Thứ tự' })
  sortOrder: number;

  @ManyToOne(() => InvitationEntity, (invitation) => invitation.timelines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;
}
