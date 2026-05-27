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
  @Column({ type: 'uuid', nullable: true })
  @Index()
  guestId: string;

  @ApiProperty({ description: 'Kênh gửi', enum: NotifChannel })
  @Column({ type: 'enum', enum: NotifChannel, nullable: false })
  channel: NotifChannel;

  @ApiProperty({ description: 'Loại thông báo', enum: NotifType })
  @Column({ type: 'enum', enum: NotifType, nullable: false })
  type: NotifType;

  @ApiProperty({ description: 'Chủ đề email', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  subject: string;

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
  status: NotifStatus;

  @ApiProperty({ description: 'Thời gian lên lịch gửi' })
  @Column({ type: 'timestamptz', nullable: false })
  scheduledAt: Date;

  @ApiProperty({ description: 'Thời gian đã gửi', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  sentAt: Date;

  @ApiProperty({ description: 'Lý do thất bại', required: false })
  @Column({ type: 'text', nullable: true })
  failedReason: string;

  @ApiProperty({
    description: 'Nhà cung cấp (Zalo ZNS, Twilio...)',
    required: false,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  provider: string;

  @ApiProperty({
    description: 'Message ID trả về từ provider',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  providerMsgId: string;
}
