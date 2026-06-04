import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NotifChannel, NotifStatus, NotifType } from './enums';

// Lịch gửi thông báo tự động - Zalo/SMS/Email qua Cron Job
@Entity('notifications')
@Index(['weddingId', 'status'])
@Index(['scheduledAt', 'status'])
export class NotificationEntity extends BaseEntity {
  @ApiProperty({ description: 'ID Đám cưới' })
  @Column({ type: 'uuid', nullable: false })
  weddingId: string;

  @ApiProperty({
    description: 'ID Khách mời (Null = gửi broadcast)',
    required: false,
  })
  // Guest Id
  @Column({ type: 'uuid', nullable: true })
  @Index()
  @ApiProperty({ description: 'Guest Id' })
  guestId: string;

  // Kênh thông báo
  @ApiProperty({ description: 'Kênh gửi', enum: NotifChannel })
  @Column({ type: 'enum', enum: NotifChannel, nullable: false })
  channel: NotifChannel;

  // Phân loại
  @ApiProperty({ description: 'Loại thông báo', enum: NotifType })
  @Column({ type: 'enum', enum: NotifType, nullable: false })
  type: NotifType;

  // Subject
  @ApiProperty({ description: 'Chủ đề email', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  subject: string;

  // Content
  @ApiProperty({ description: 'Nội dung thông báo' })
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty({ description: 'Trạng thái gửi', enum: NotifStatus })
  @Column({
    type: 'enum',
    enum: NotifStatus,
    default: NotifStatus.PENDING,
    nullable: false,
  })
  // Trạng thái
  @ApiProperty({ description: 'Trạng thái' })
  status: NotifStatus;

  // Scheduled At
  @ApiProperty({ description: 'Thời gian lên lịch gửi' })
  @Column({ type: 'timestamptz', nullable: false })
  scheduledAt: Date;

  // Sent At
  @ApiProperty({ description: 'Thời gian đã gửi', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  sentAt: Date;

  // Failed Reason
  @ApiProperty({ description: 'Lý do thất bại', required: false })
  @Column({ type: 'text', nullable: true })
  failedReason: string;

  @ApiProperty({
    description: 'Nhà cung cấp (Zalo ZNS, Twilio...)',
    required: false,
  })
  // Provider
  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Provider' })
  provider: string;

  @ApiProperty({
    description: 'Message ID trả về từ provider',
    required: false,
  })
  // Provider Msg Id
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Provider Msg Id' })
  providerMsgId: string;
}
