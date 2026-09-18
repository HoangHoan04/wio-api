import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GuestGroupEntity } from './guest-group.entity';
import { InvitationEntity } from './invitation.entity';
import { TableEntity } from './table.entity';

@Entity('guests')
@Index(['invitationId', 'rsvpStatus'])
@Index(['invitationId', 'tableId'])
@Index(['invitationCode'], { unique: true })
export class GuestEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @Column({ type: 'uuid', nullable: false })
  invitationId: string;

  @ApiPropertyOptional({ description: 'ID nhóm khách' })
  @Column({ type: 'uuid', nullable: true })
  groupId?: string;

  @ApiPropertyOptional({ description: 'ID bàn tiệc' })
  @Column({ type: 'uuid', nullable: true })
  tableId?: string;

  @ApiProperty({ description: 'Họ và tên khách mời' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  fullName: string;

  @ApiPropertyOptional({ description: 'Danh xưng (Anh/Chị/Ông/Bà…)' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  salutation?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại khách' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @ApiPropertyOptional({ description: 'Email khách' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @ApiProperty({ description: 'Khách VIP' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isVip: boolean;

  @ApiProperty({ description: 'Mã lời mời (dùng để tra cứu RSVP)' })
  @Column({ type: 'varchar', length: 32, nullable: false, unique: true })
  invitationCode: string;

  @ApiPropertyOptional({ description: 'URL QR code check-in' })
  @Column({ type: 'text', nullable: true })
  qrCodeUrl?: string;

  @ApiProperty({ description: 'Trạng thái RSVP', enum: enumData.RSVP_STATUS })
  @Column({ type: 'varchar', length: 20, nullable: false })
  rsvpStatus: string;

  @ApiProperty({ description: 'Số người tham dự' })
  @Column({ type: 'smallint', default: 1, nullable: false })
  attendingCount: number;

  @ApiProperty({ description: 'Cần đưa đón?' })
  @Column({ type: 'boolean', default: false, nullable: false })
  needsTransport: boolean;

  @ApiPropertyOptional({ description: 'Ghi chú RSVP' })
  @Column({ type: 'text', nullable: true })
  rsvpNote?: string;

  @ApiPropertyOptional({ description: 'Thời điểm khách phản hồi RSVP' })
  @Column({ type: 'timestamptz', nullable: true })
  rsvpAt?: Date;

  @ApiPropertyOptional({ description: 'Thời điểm gửi lời mời' })
  @Column({ type: 'timestamptz', nullable: true })
  invitedAt?: Date;

  @ApiPropertyOptional({ description: 'Thời điểm khách xem lời mời' })
  @Column({ type: 'timestamptz', nullable: true })
  invitationViewedAt?: Date;

  @ApiPropertyOptional({ description: 'Thời điểm khách check-in' })
  @Column({ type: 'timestamptz', nullable: true })
  checkedInAt?: Date;

  @ManyToOne(() => InvitationEntity, (i) => i.guests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;

  @ManyToOne(() => GuestGroupEntity, (g) => g.guests, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'groupId' })
  group?: GuestGroupEntity;

  @ManyToOne(() => TableEntity, (t) => t.guests, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'tableId' })
  table?: TableEntity;
}
