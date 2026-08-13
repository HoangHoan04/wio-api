import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('photo_wall')
@Index(['invitationId', 'isApproved'])
export class PhotoWallEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID thiệp' })
  invitationId: string;

  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'Id khách mời', required: false })
  guestId?: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Tên người tải lên' })
  uploaderName: string;

  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'Đường dẫn URL' })
  url: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @ApiProperty({ description: 'Khoá lưu trữ', required: false })
  storageKey?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Caption', required: false })
  caption?: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  @ApiProperty({ description: 'Đã duyệt' })
  isApproved: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày duyệt', required: false })
  approvedAt?: Date;

  @ManyToOne(() => InvitationEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;
}
