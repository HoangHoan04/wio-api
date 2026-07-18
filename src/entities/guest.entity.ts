import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TableEntity } from './table.entity';
import { WeddingEntity } from './wedding.entity';

@Entity('guests')
@Index(['weddingId', 'rsvpStatus'])
@Index(['weddingId', 'tableId'])
export class GuestEntity extends BaseEntity {
  // ID đám cưới
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID đám cưới' })
  weddingId: string;

  // Bàn tiệc
  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'Bàn tiệc' })
  tableId?: string;

  // Họ và tên
  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Họ và tên' })
  fullName: string;

  // Lời mời
  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Lời mời' })
  salutation?: string;

  // Nhà trai/Nhà gái
  @Column({ type: 'varchar', length: 20, nullable: false })
  @ApiProperty({ description: 'Nhà trai/Nhà gái' })
  side: string;

  // Khách mời này có phải khách VIP không
  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Is Vip' })
  isVip: boolean;

  // Mã lời mời
  @Column({ type: 'varchar', length: 32, unique: true, nullable: false })
  @ApiProperty({ description: 'Mã lời mời' })
  invitationCode: string;

  // Qr Code Url
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Qr Code Url' })
  qrCodeUrl?: string;

  // Trạng thái RSVP
  @Column({ type: 'varchar', length: 20, nullable: false })
  @ApiProperty({ description: 'Trạng thái RSVP' })
  rsvpStatus: string;

  // Số người tham dự
  @Column({ type: 'smallint', default: 1, nullable: false })
  @ApiProperty({ description: 'Số người tham dự' })
  attendingCount: number;

  // Cần đưa đón
  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Cần đưa đón' })
  needsTransport: boolean;

  // Rsvp Note
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Rsvp Note' })
  rsvpNote?: string;

  // Ngày RSVP
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày RSVP' })
  rsvpAt?: Date;

  // Ngày mời
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày mời' })
  invitedAt?: Date;

  // Ngày xem lời mời
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày xem lời mời' })
  invitationViewedAt?: Date;

  @ManyToOne(() => WeddingEntity, (wedding) => wedding.guests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'weddingId' })
  @ApiProperty({ description: 'Đám cưới' })
  wedding: WeddingEntity;

  @ManyToOne(() => TableEntity, (table) => table.guests, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'tableId' })
  @ApiProperty({ description: 'Table' })
  table: TableEntity;
}
