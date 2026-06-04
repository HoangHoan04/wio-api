import { ApiProperty } from '@nestjs/swagger';
import { Entity, Index, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GuestSide, RsvpStatus, DietaryPref } from './enums';
import { GuestGroupEntity } from './guest-group.entity';
import { TableEntity } from './table.entity';
import { WeddingEntity } from './wedding.entity';

// ==================== GUESTS ====================
@Entity('guests')
@Index(['weddingId', 'rsvpStatus'])
@Index(['weddingId', 'tableId'])
export class GuestEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID đám cưới' })
  weddingId: string;

  // Group Id
  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'Group Id' })
  groupId: string;

  // Table Id
  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'Table Id' })
  tableId: string;

  // Họ và tên
  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Họ và tên' })
  fullName: string;

  // Số điện thoại
  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Số điện thoại' })
  phone: string;

  // Email
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Email' })
  email: string;

  // Salutation
  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Salutation' })
  salutation: string;

  // Nhà trai/Nhà gái
  @Column({
    type: 'enum',
    enum: GuestSide,
    default: GuestSide.BOTH,
    nullable: false,
  })
  @ApiProperty({ description: 'Nhà trai/Nhà gái' })
  side: GuestSide;

  // Is Vip
  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Is Vip' })
  isVip: boolean;

  // Invitation Code
  @Column({ type: 'varchar', length: 32, unique: true, nullable: false })
  @ApiProperty({ description: 'Invitation Code' })
  invitationCode: string;

  // Qr Code Url
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Qr Code Url' })
  qrCodeUrl: string;

  // Trạng thái RSVP
  @Column({
    type: 'enum',
    enum: RsvpStatus,
    default: RsvpStatus.PENDING,
    nullable: false,
  })
  @ApiProperty({ description: 'Trạng thái RSVP' })
  rsvpStatus: RsvpStatus;

  // Số người tham dự
  @Column({ type: 'smallint', default: 1, nullable: false })
  @ApiProperty({ description: 'Số người tham dự' })
  attendingCount: number;

  // Chế độ ăn
  @Column({
    type: 'enum',
    enum: DietaryPref,
    default: DietaryPref.NORMAL,
    nullable: false,
  })
  @ApiProperty({ description: 'Chế độ ăn' })
  dietary: DietaryPref;

  // Dietary Note
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Dietary Note' })
  dietaryNote: string;

  // Cần đưa đón
  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Cần đưa đón' })
  needsTransport: boolean;

  // Rsvp Note
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Rsvp Note' })
  rsvpNote: string;

  // Ngày RSVP
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày RSVP' })
  rsvpAt: Date;

  // Invited At
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Invited At' })
  invitedAt: Date;

  // Invitation Viewed At
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Invitation Viewed At' })
  invitationViewedAt: Date;

  // Wedding
  @ManyToOne(() => WeddingEntity, (wedding) => wedding.guests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'weddingId' })
  @ApiProperty({ description: 'Wedding' })
  wedding: WeddingEntity;

  // Table
  @ManyToOne(() => TableEntity, (table) => table.guests, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'tableId' })
  @ApiProperty({ description: 'Table' })
  table: TableEntity;

  // Group
  @ManyToOne(() => GuestGroupEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'groupId' })
  @ApiProperty({ description: 'Group' })
  group: GuestGroupEntity;
}
