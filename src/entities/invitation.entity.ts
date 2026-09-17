import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AiScanJobEntity } from './ai-scan-job.entity';
import { BaseEntity } from './base.entity';
import { GuestGroupEntity } from './guest-group.entity';
import { GuestEntity } from './guest.entity';
import { InvitationEventEntity } from './invitation-event.entity';
import { InvitationGiftEntity } from './invitation-gift.entity';
import { InvitationHostEntity } from './invitation-host.entity';
import { InvitationPhotoEntity } from './invitation-photo.entity';
import { InvitationTimelineEntity } from './invitation-timeline.entity';
import { InvitationVersionEntity } from './invitation-version.entity';
import { NotificationEntity } from './notification.entity';
import { PhotoWallEntity } from './photo-wall.entity';
import { SlugHistoryEntity } from './slug-history.entity';
import { TableEntity } from './table.entity';
import { TemplateEntity } from './template.entity';
import { UserEntity } from './user.entity';
import { WeddingInfoEntity } from './wedding-info.entity';
import { WishEntity } from './wish.entity';

@Entity('invitations')
@Index('UQ_invitation_slug', ['slug'], {
  unique: true,
  where: `"status" != 'ARCHIVED' AND "isDeleted" = false`,
})
@Index(['userId', 'status'])
export class InvitationEntity extends BaseEntity {
  @ApiProperty({ description: 'ID user sở hữu thiệp' })
  @Index()
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @ApiProperty({
    description: 'Chế độ thiết kế thiệp',
    enum: enumData.DESIGN_MODE,
  })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: enumData.DESIGN_MODE.TEMPLATE.code,
  })
  designMode: string;

  @ApiProperty({ description: 'Phong cách cưới', enum: enumData.WEDDING_THEME })
  @Column({ type: 'varchar', length: 30, nullable: false })
  weddingTheme: string;

  @ApiPropertyOptional({
    description: 'ID template (nếu designMode = TEMPLATE)',
  })
  @Column({ type: 'uuid', nullable: true })
  templateId?: string;

  @ApiProperty({ description: 'Tiêu đề thiệp cưới' })
  @Column({ type: 'varchar', length: 200, nullable: false })
  title: string;

  @ApiProperty({ description: 'Slug công khai dạng /thiep-cuoi/{slug}' })
  @Index()
  @Column({ type: 'varchar', length: 100, nullable: false })
  slug: string;

  @ApiProperty({
    description: 'Trạng thái thiệp',
    enum: enumData.INVITATION_STATUS,
  })
  @Index()
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: enumData.INVITATION_STATUS.DRAFT.code,
  })
  status: string;

  @ApiPropertyOptional({ description: 'Lời mời' })
  @Column({ type: 'text', nullable: true })
  invitationText?: string;

  @ApiPropertyOptional({ description: 'Lời cảm ơn' })
  @Column({ type: 'text', nullable: true })
  thankYouText?: string;

  @ApiPropertyOptional({ description: 'URL ảnh cover chính' })
  @Column({ type: 'text', nullable: true })
  heroImageUrl?: string;

  @ApiPropertyOptional({ description: 'Thời điểm diễn ra sự kiện chính' })
  @Index()
  @Column({ type: 'timestamptz', nullable: true })
  primaryEventAt?: Date;

  @ApiPropertyOptional({
    description: 'Bật/tắt các section hiển thị trên thiệp',
  })
  @Column({ type: 'jsonb', nullable: true })
  sectionConfig?: Record<string, boolean>;

  @ApiPropertyOptional({ description: 'ID nhạc nền' })
  @Column({ type: 'uuid', nullable: true })
  musicId?: string;

  @ApiPropertyOptional({ description: 'Cấu hình phát nhạc nền' })
  @Column({ type: 'jsonb', nullable: true })
  musicConfig?: { autoplay?: boolean; loop?: boolean; volume?: number };

  @ApiPropertyOptional({ description: 'Dữ liệu thiết kế tự do (Canva mode)' })
  @Column({ type: 'jsonb', nullable: true })
  customDesign?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Metadata do AI sinh ra (AI_SCAN mode)' })
  @Column({ type: 'jsonb', nullable: true })
  aiGeneratedMeta?: Record<string, any>;

  @ApiPropertyOptional({ description: 'URL chia sẻ thiệp' })
  @Column({ type: 'text', nullable: true })
  shareUrl?: string;

  @ApiPropertyOptional({ description: 'URL ảnh QR chia sẻ' })
  @Column({ type: 'text', nullable: true })
  shareQrUrl?: string;

  @ApiPropertyOptional({ description: 'Tiêu đề SEO' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'Mô tả SEO' })
  @Column({ type: 'text', nullable: true })
  seoDescription?: string;

  @ApiProperty({ description: 'Tổng lượt xem' })
  @Column({ type: 'int', default: 0, nullable: false })
  viewCount: number;

  @ApiProperty({ description: 'Lượt xem duy nhất' })
  @Column({ type: 'int', default: 0, nullable: false })
  uniqueViewCount: number;

  @ApiPropertyOptional({ description: 'Thời điểm xuất bản thiệp' })
  @Column({ type: 'timestamptz', nullable: true })
  publishedAt?: Date;

  @ApiPropertyOptional({ description: 'Thời điểm hết hạn thiệp' })
  @Column({ type: 'timestamptz', nullable: true })
  expiresAt?: Date;

  @ManyToOne(() => UserEntity, (u) => u.invitations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => TemplateEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'templateId' })
  template?: TemplateEntity;

  @OneToOne(() => WeddingInfoEntity, (w) => w.invitation, { cascade: true })
  weddingInfo: WeddingInfoEntity;

  @OneToMany(() => InvitationHostEntity, (h) => h.invitation, { cascade: true })
  hosts: InvitationHostEntity[];

  @OneToMany(() => InvitationEventEntity, (e) => e.invitation, {
    cascade: true,
  })
  events: InvitationEventEntity[];

  @OneToMany(() => InvitationTimelineEntity, (t) => t.invitation, {
    cascade: true,
  })
  timelines: InvitationTimelineEntity[];

  @OneToMany(() => InvitationPhotoEntity, (p) => p.invitation, {
    cascade: true,
  })
  photos: InvitationPhotoEntity[];

  @OneToMany(() => InvitationGiftEntity, (g) => g.invitation, { cascade: true })
  gifts: InvitationGiftEntity[];

  @OneToMany(() => InvitationVersionEntity, (v) => v.invitation)
  versions: InvitationVersionEntity[];

  @OneToMany(() => GuestGroupEntity, (g) => g.invitation, { cascade: true })
  guestGroups: GuestGroupEntity[];

  @OneToMany(() => GuestEntity, (g) => g.invitation)
  guests: GuestEntity[];

  @OneToMany(() => TableEntity, (t) => t.invitation)
  tables: TableEntity[];

  @OneToMany(() => WishEntity, (w) => w.invitation)
  wishes: WishEntity[];

  @OneToMany(() => PhotoWallEntity, (p) => p.invitation)
  photoWall: PhotoWallEntity[];

  @OneToMany(() => NotificationEntity, (n) => n.invitation)
  notifications: NotificationEntity[];

  @OneToMany(() => SlugHistoryEntity, (s) => s.invitation)
  slugHistories: SlugHistoryEntity[];

  @OneToMany(() => AiScanJobEntity, (a) => a.invitation)
  aiScanJobs: AiScanJobEntity[];
}
