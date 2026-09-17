import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('invitation_photos')
@Index(['invitationId', 'kind'])
export class InvitationPhotoEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @Column({ type: 'uuid', nullable: false })
  invitationId: string;

  @ApiProperty({ description: 'URL ảnh' })
  @Column({ type: 'text', nullable: false })
  url: string;

  @ApiPropertyOptional({ description: 'Storage key trên cloud' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  storageKey?: string;

  @ApiPropertyOptional({ description: 'Chú thích ảnh' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  caption?: string;

  @ApiProperty({ description: 'Loại ảnh', enum: enumData.PHOTO_KIND })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: enumData.PHOTO_KIND.GALLERY.code,
  })
  kind: string;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  @Column({ type: 'int', default: 0, nullable: false })
  sortOrder: number;

  @ManyToOne(() => InvitationEntity, (i) => i.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;
}
