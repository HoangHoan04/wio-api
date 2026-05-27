import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DietaryPref, GuestSide, RsvpStatus } from './enums';

// Danh sách khách mời - có thể import từ Excel, có mã QR cá nhân hóa
@Entity('guests')
@Index(['weddingId', 'rsvpStatus'])
@Index(['weddingId', 'tableId'])
export class GuestEntity extends BaseEntity {
  @ApiProperty({ description: 'ID Đám cưới' })
  @Column({ type: 'uuid', nullable: false })
  weddingId: string;

  @ApiProperty({ description: 'ID Nhóm khách mời', required: false })
  @Column({ type: 'uuid', nullable: true })
  groupId: string;

  @ApiProperty({
    description: 'ID Bàn tiệc (Null nếu chưa xếp)',
    required: false,
  })
  @Column({ type: 'uuid', nullable: true })
  tableId: string;

  @ApiProperty({ description: 'Họ và tên khách mời' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  fullName: string;

  @ApiProperty({ description: 'Số điện thoại', required: false })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @ApiProperty({ description: 'Email', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @ApiProperty({ description: 'Danh xưng (Anh, Chị, Bác...)', required: false })
  @Column({ type: 'varchar', length: 20, nullable: true })
  salutation: string;

  @ApiProperty({ description: 'Khách của ai', enum: GuestSide })
  @Column({
    type: 'enum',
    enum: GuestSide,
    default: GuestSide.BOTH,
    nullable: false,
  })
  side: GuestSide;

  @ApiProperty({ description: 'Khách VIP?' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isVip: boolean;

  @ApiProperty({ description: 'Mã mời cá nhân hóa (Unique)' })
  @Column({ type: 'varchar', length: 32, unique: true, nullable: false })
  invitationCode: string;

  @ApiProperty({ description: 'URL ảnh QR Code cá nhân', required: false })
  @Column({ type: 'text', nullable: true })
  qrCodeUrl: string;

  @ApiProperty({ description: 'Trạng thái RSVP', enum: RsvpStatus })
  @Column({
    type: 'enum',
    enum: RsvpStatus,
    default: RsvpStatus.PENDING,
    nullable: false,
  })
  rsvpStatus: RsvpStatus;

  @ApiProperty({ description: 'Số người đi kèm (+1, +2...)' })
  @Column({ type: 'smallint', default: 1, nullable: false })
  attendingCount: number;

  @ApiProperty({ description: 'Chế độ ăn', enum: DietaryPref })
  @Column({
    type: 'enum',
    enum: DietaryPref,
    default: DietaryPref.NORMAL,
    nullable: false,
  })
  dietary: DietaryPref;

  @ApiProperty({ description: 'Ghi chú chế độ ăn', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  dietaryNote: string;

  @ApiProperty({ description: 'Cần phương tiện di chuyển?' })
  @Column({ type: 'boolean', default: false, nullable: false })
  needsTransport: boolean;

  @ApiProperty({ description: 'Lời nhắn khi RSVP', required: false })
  @Column({ type: 'text', nullable: true })
  rsvpNote: string;

  @ApiProperty({ description: 'Thời gian RSVP', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  rsvpAt: Date;

  @ApiProperty({
    description: 'Thời điểm link thiệp được gửi đi',
    required: false,
  })
  @Column({ type: 'timestamptz', nullable: true })
  invitedAt: Date;

  @ApiProperty({ description: 'Lần đầu khách mở thiệp', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  invitationViewedAt: Date;
}
