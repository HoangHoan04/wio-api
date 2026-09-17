import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GuestEntity } from './guest.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('wishes')
@Index(['invitationId', 'isApproved'])
export class WishEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @Column({ type: 'uuid', nullable: false })
  invitationId: string;

  @ApiPropertyOptional({ description: 'ID khách mời gửi lời chúc' })
  @Column({ type: 'uuid', nullable: true })
  guestId?: string;

  @ApiProperty({ description: 'Tên người gửi lời chúc' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  guestName: string;

  @ApiProperty({ description: 'Nội dung lời chúc' })
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty({ description: 'Lời chúc đã được duyệt hiển thị' })
  @Column({ type: 'boolean', default: true, nullable: false })
  isApproved: boolean;

  @ApiProperty({ description: 'Ghim lời chúc lên đầu' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isPinned: boolean;

  @ApiPropertyOptional({ description: 'Thời điểm duyệt lời chúc' })
  @Column({ type: 'timestamptz', nullable: true })
  approvedAt?: Date;

  @ManyToOne(() => InvitationEntity, (i) => i.wishes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;

  @ManyToOne(() => GuestEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'guestId' })
  guest?: GuestEntity;
}
