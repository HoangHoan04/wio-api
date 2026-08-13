import { enumData } from '@/common/constanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GuestGroupEntity } from './guest-group.entity';
import { InvitationEntity } from './invitation.entity';
import { TableEntity } from './table.entity';

@Entity('guests')
@Index(['invitationId', 'rsvpStatus'])
@Index(['invitationId', 'tableId'])
export class GuestEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID thiệp' })
  invitationId: string;

  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'Nhóm khách', required: false })
  groupId?: string;

  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'Bàn tiệc', required: false })
  tableId?: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Họ và tên' })
  fullName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Danh xưng', required: false })
  salutation?: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Khách VIP' })
  isVip: boolean;

  @Column({ type: 'varchar', length: 32, unique: true, nullable: false })
  @ApiProperty({ description: 'Mã lời mời' })
  invitationCode: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'QR Code Url', required: false })
  qrCodeUrl?: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  @ApiProperty({ description: 'Trạng thái RSVP', enum: enumData.RSVP_STATUS })
  rsvpStatus: string;

  @Column({ type: 'smallint', default: 1, nullable: false })
  @ApiProperty({ description: 'Số người tham dự' })
  attendingCount: number;

  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Cần đưa đón' })
  needsTransport: boolean;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Ghi chú RSVP', required: false })
  rsvpNote?: string;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày RSVP', required: false })
  rsvpAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày mời', required: false })
  invitedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày xem lời mời', required: false })
  invitationViewedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày check-in', required: false })
  checkedInAt?: Date;

  @ManyToOne(() => InvitationEntity, (invitation) => invitation.guests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;

  @ManyToOne(() => GuestGroupEntity, (group) => group.guests, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'groupId' })
  group: GuestGroupEntity;

  @ManyToOne(() => TableEntity, (table) => table.guests, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'tableId' })
  table: TableEntity;
}
