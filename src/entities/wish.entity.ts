import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('wishes')
@Index(['invitationId', 'isApproved'])
export class WishEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID thiệp' })
  invitationId: string;

  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'Guest Id', required: false })
  guestId?: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Tên người gửi' })
  guestName: string;

  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'Nội dung' })
  content: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  @ApiProperty({ description: 'Đã duyệt' })
  isApproved: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Ghim' })
  isPinned: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày duyệt', required: false })
  approvedAt?: Date;

  @ManyToOne(() => InvitationEntity, (invitation) => invitation.wishes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;
}
