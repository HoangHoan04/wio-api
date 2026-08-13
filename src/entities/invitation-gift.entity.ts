import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('invitation_gifts')
export class InvitationGiftEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID thiệp' })
  invitationId: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  @ApiProperty({ description: 'Nhãn tài khoản' })
  label: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Tên ngân hàng', required: false })
  bankName?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Số tài khoản', required: false })
  accountNumber?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Chủ tài khoản', required: false })
  accountOwner?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Ảnh QR', required: false })
  qrUrl?: string;

  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({ description: 'Thứ tự' })
  sortOrder: number;

  @ManyToOne(() => InvitationEntity, (invitation) => invitation.gifts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;
}
