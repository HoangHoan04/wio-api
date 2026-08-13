import { enumData } from '@/common/constanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('invitation_photos')
export class InvitationPhotoEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID thiệp' })
  invitationId: string;

  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'URL ảnh' })
  url: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @ApiProperty({ description: 'Storage key', required: false })
  storageKey?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Caption', required: false })
  caption?: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: enumData.PHOTO_KIND.GALLERY.code })
  @ApiProperty({ description: 'Loại ảnh', enum: enumData.PHOTO_KIND })
  kind: string;

  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({ description: 'Thứ tự' })
  sortOrder: number;

  @ManyToOne(() => InvitationEntity, (invitation) => invitation.photos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;
}
