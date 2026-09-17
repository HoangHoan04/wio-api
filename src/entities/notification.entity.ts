import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GuestEntity } from './guest.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('notifications')
@Index(['invitationId', 'status'])
@Index(['scheduledAt', 'status'])
export class NotificationEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @Column({ type: 'uuid', nullable: false })
  invitationId: string;

  @ApiPropertyOptional({ description: 'ID khách mời nhận thông báo' })
  @Index()
  @Column({ type: 'uuid', nullable: true })
  guestId?: string;

  @ApiProperty({ description: 'Kênh gửi', enum: enumData.NOTIF_CHANNEL })
  @Column({ type: 'varchar', length: 20, nullable: false })
  channel: string;

  @ApiProperty({ description: 'Loại thông báo', enum: enumData.NOTIF_TYPE })
  @Column({ type: 'varchar', length: 40, nullable: false })
  type: string;

  @ApiPropertyOptional({ description: 'Tiêu đề email' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  subject?: string;

  @ApiProperty({ description: 'Nội dung thông báo' })
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty({ description: 'Trạng thái gửi', enum: enumData.NOTIF_STATUS })
  @Column({ type: 'varchar', length: 20, nullable: false })
  status: string;

  @ApiProperty({ description: 'Thời gian dự kiến gửi' })
  @Column({ type: 'timestamptz', nullable: false })
  scheduledAt: Date;

  @ApiPropertyOptional({ description: 'Thời gian đã gửi' })
  @Column({ type: 'timestamptz', nullable: true })
  sentAt?: Date;

  @ApiPropertyOptional({ description: 'Lý do gửi thất bại' })
  @Column({ type: 'text', nullable: true })
  failedReason?: string;

  @ApiPropertyOptional({ description: 'Nhà cung cấp dịch vụ gửi' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  provider?: string;

  @ApiPropertyOptional({ description: 'ID tin nhắn từ provider' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  providerMsgId?: string;

  @ManyToOne(() => InvitationEntity, (i) => i.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;

  @ManyToOne(() => GuestEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'guestId' })
  guest?: GuestEntity;
}
