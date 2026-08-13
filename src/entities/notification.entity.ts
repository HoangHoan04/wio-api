import { enumData } from '@/common/constanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('notifications')
@Index(['invitationId', 'status'])
@Index(['scheduledAt', 'status'])
export class NotificationEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID thiệp' })
  invitationId: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  @ApiProperty({ description: 'Guest Id', required: false })
  guestId?: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Kênh gửi', enum: enumData.NOTIF_CHANNEL })
  channel: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Loại thông báo', enum: enumData.NOTIF_TYPE })
  type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Chủ đề email', required: false })
  subject?: string;

  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'Nội dung thông báo' })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Trạng thái', enum: enumData.NOTIF_STATUS })
  status: string;

  @Column({ type: 'timestamptz', nullable: false })
  @ApiProperty({ description: 'Thời gian lên lịch gửi' })
  scheduledAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Thời gian đã gửi', required: false })
  sentAt?: Date;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Lý do thất bại', required: false })
  failedReason?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Nơi gửi thông báo', required: false })
  provider?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Message ID từ provider', required: false })
  providerMsgId?: string;
}
