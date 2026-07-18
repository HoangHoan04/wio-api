import { enumData } from '@/common/contanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

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
  // Id khách mời
  @Column({ type: 'uuid', nullable: true })
  @Index()
  @ApiProperty({ description: 'Guest Id' })
  guestId: string;

  // Kênh thông báo
  @ApiProperty({ description: 'Kênh gửi', enum: enumData.NOTIF_CHANNEL })
  @Column({ type: 'varchar', length: 255, nullable: false })
  channel: string;

  // Phân loại
  @ApiProperty({ description: 'Loại thông báo', enum: enumData.NOTIF_TYPE })
  @Column({ type: 'varchar', length: 255, nullable: false })
  type: string;

  // Chủ đề email
  @ApiProperty({ description: 'Chủ đề email', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  subject: string;

  // Nội dung thông báo
  @ApiProperty({ description: 'Nội dung thông báo' })
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty({ description: 'Trạng thái gửi', enum: enumData.NOTIF_STATUS })
  @Column({ type: 'varchar', length: 255, nullable: false })
  // Trạng thái
  @ApiProperty({ description: 'Trạng thái' })
  status: string;

  // Ngày lên lịch gửi
  @ApiProperty({ description: 'Thời gian lên lịch gửi' })
  @Column({ type: 'timestamptz', nullable: false })
  scheduledAt: Date;

  // Ngày gửi
  @ApiProperty({ description: 'Thời gian đã gửi', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  sentAt: Date;

  // Lý do thất bại
  @ApiProperty({ description: 'Lý do thất bại', required: false })
  @Column({ type: 'text', nullable: true })
  failedReason: string;

  @ApiProperty({
    description: 'Nhà cung cấp (Zalo ZNS, Twilio...)',
    required: false,
  })
  // Nơi gửi thông báo (Zalo ZNS, Twilio...)
  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Nơi gửi thông báo' })
  provider: string;

  @ApiProperty({
    description: 'Message ID trả về từ provider',
    required: false,
  })
  // Message ID trả về từ provider
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Message ID từ provider' })
  providerMsgId: string;
}
