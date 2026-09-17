import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('invitation_gifts')
export class InvitationGiftEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @Column({ type: 'uuid', nullable: false })
  invitationId: string;

  @ApiProperty({ description: 'Nhãn hiển thị của tài khoản nhận quà' })
  @Column({ type: 'varchar', length: 150, nullable: false })
  label: string;

  @ApiPropertyOptional({ description: 'Tên ngân hàng' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankName?: string;

  @ApiPropertyOptional({ description: 'Số tài khoản' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  accountNumber?: string;

  @ApiPropertyOptional({ description: 'Tên chủ tài khoản' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  accountOwner?: string;

  @ApiPropertyOptional({ description: 'URL ảnh QR chuyển khoản' })
  @Column({ type: 'text', nullable: true })
  qrUrl?: string;

  @ApiPropertyOptional({
    description: 'Bên nhận quà',
    enum: enumData.GUEST_SIDE,
  })
  @Column({ type: 'varchar', length: 20, nullable: true })
  side?: string;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  @Column({ type: 'int', default: 0, nullable: false })
  sortOrder: number;

  @ManyToOne(() => InvitationEntity, (i) => i.gifts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;
}
