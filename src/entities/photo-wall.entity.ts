import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GuestEntity } from './guest.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('photo_wall')
@Index(['invitationId', 'isApproved'])
export class PhotoWallEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @Column({ type: 'uuid', nullable: false })
  invitationId: string;

  @ApiPropertyOptional({ description: 'ID khách mời tải ảnh lên' })
  @Column({ type: 'uuid', nullable: true })
  guestId?: string;

  @ApiProperty({ description: 'Tên người tải ảnh lên' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  uploaderName: string;

  @ApiProperty({ description: 'URL ảnh' })
  @Column({ type: 'text', nullable: false })
  url: string;

  @ApiPropertyOptional({ description: 'Storage key trên cloud' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  storageKey?: string;

  @ApiPropertyOptional({ description: 'Chú thích ảnh' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  caption?: string;

  @ApiProperty({ description: 'Ảnh đã được duyệt hiển thị' })
  @Column({ type: 'boolean', default: true, nullable: false })
  isApproved: boolean;

  @ApiPropertyOptional({ description: 'Thời điểm ảnh được duyệt' })
  @Column({ type: 'timestamptz', nullable: true })
  approvedAt?: Date;

  @ManyToOne(() => InvitationEntity, (i) => i.photoWall, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;

  @ManyToOne(() => GuestEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'guestId' })
  guest?: GuestEntity;
}
