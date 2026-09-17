import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

/**
 * Thông tin cặp đôi — tách riêng khỏi Invitation để rõ ràng.
 * Mỗi thiệp cưới có đúng 1 WeddingInfo.
 */
@Entity('wedding_infos')
export class WeddingInfoEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @Column({ type: 'uuid', nullable: false, unique: true })
  invitationId: string;

  // ---- Cô dâu ----
  @ApiProperty({ description: 'Tên cô dâu' })
  @Column({ type: 'varchar', length: 150, nullable: false })
  brideName: string;

  @ApiPropertyOptional({ description: 'Tên ngắn cô dâu' })
  @Column({ type: 'varchar', length: 150, nullable: true })
  brideShortName?: string;

  @ApiPropertyOptional({ description: 'URL ảnh cô dâu' })
  @Column({ type: 'text', nullable: true })
  bridePhotoUrl?: string;

  @ApiPropertyOptional({ description: 'Tên bố cô dâu' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  brideFatherName?: string;

  @ApiPropertyOptional({ description: 'Tên mẹ cô dâu' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  brideMotherName?: string;

  @ApiPropertyOptional({ description: 'Tiểu sử cô dâu' })
  @Column({ type: 'text', nullable: true })
  brideBio?: string;

  @ApiPropertyOptional({ description: 'MXH cô dâu (facebook, instagram…)' })
  @Column({ type: 'jsonb', nullable: true })
  brideSocial?: Record<string, string>;

  // ---- Chú rể ----
  @ApiProperty({ description: 'Tên chú rể' })
  @Column({ type: 'varchar', length: 150, nullable: false })
  groomName: string;

  @ApiPropertyOptional({ description: 'Tên ngắn chú rể' })
  @Column({ type: 'varchar', length: 150, nullable: true })
  groomShortName?: string;

  @ApiPropertyOptional({ description: 'URL ảnh chú rể' })
  @Column({ type: 'text', nullable: true })
  groomPhotoUrl?: string;

  @ApiPropertyOptional({ description: 'Tên bố chú rể' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  groomFatherName?: string;

  @ApiPropertyOptional({ description: 'Tên mẹ chú rể' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  groomMotherName?: string;

  @ApiPropertyOptional({ description: 'Tiểu sử chú rể' })
  @Column({ type: 'text', nullable: true })
  groomBio?: string;

  @ApiPropertyOptional({ description: 'MXH chú rể' })
  @Column({ type: 'jsonb', nullable: true })
  groomSocial?: Record<string, string>;

  // ---- Chung ----
  @ApiPropertyOptional({ description: 'Ngày bắt đầu yêu nhau' })
  @Column({ type: 'timestamptz', nullable: true })
  loveStartedAt?: Date;

  @ApiPropertyOptional({ description: 'Câu chuyện tình yêu' })
  @Column({ type: 'text', nullable: true })
  loveStory?: string;

  @ApiPropertyOptional({ description: 'Hashtag cưới' })
  @Column({ type: 'varchar', length: 80, nullable: true })
  hashtag?: string;

  @OneToOne(() => InvitationEntity, (i) => i.weddingInfo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;
}
