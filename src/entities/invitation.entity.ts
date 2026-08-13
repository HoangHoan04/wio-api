import { enumData } from '@/common/constanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { GuestEntity } from './guest.entity';
import { GuestGroupEntity } from './guest-group.entity';
import { InvitationEventEntity } from './invitation-event.entity';
import { InvitationGiftEntity } from './invitation-gift.entity';
import { InvitationHostEntity } from './invitation-host.entity';
import { InvitationPhotoEntity } from './invitation-photo.entity';
import { InvitationTimelineEntity } from './invitation-timeline.entity';
import { TableEntity } from './table.entity';
import { TemplateEntity } from './template.entity';
import { UserEntity } from './user.entity';
import { WishEntity } from './wish.entity';

@Entity('invitations')
@Index('UQ_invitation_slug', ['slug'], {
  unique: true,
  where: `"status" != 'ARCHIVED' AND "isDeleted" = false`,
})
export class InvitationEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @Index()
  @ApiProperty({ description: 'ID User sở hữu' })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'ID Template', required: false })
  templateId?: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  @Index()
  @ApiProperty({ description: 'Loại thiệp', enum: enumData.CARD_TYPE })
  cardType: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  @ApiProperty({ description: 'Tiêu đề thiệp' })
  title: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'URL công khai: /thiep/slug' })
  slug: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  @Index()
  @ApiProperty({ description: 'Trạng thái', enum: enumData.INVITATION_STATUS })
  status: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Lời mời', required: false })
  invitationText?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Lời cảm ơn', required: false })
  thankYouText?: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  @ApiProperty({ description: 'Hashtag', required: false })
  hashtag?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Ảnh cover', required: false })
  heroImageUrl?: string;

  @Column({ type: 'timestamptz', nullable: true })
  @Index()
  @ApiProperty({ description: 'Thời điểm sự kiện chính', required: false })
  primaryEventAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Bật/tắt section', required: false })
  sectionConfig?: Record<string, boolean>;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Module được bật', required: false })
  enabledModules?: string[];

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Nhạc nền', required: false })
  music?: { url?: string; type?: string; autoplay?: boolean; name?: string };

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Nội dung theo loại thiệp', required: false })
  extraContent?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Thiết kế Konva', required: false })
  customDesign?: any;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Cấu hình envelope/cover', required: false })
  coverConfig?: Record<string, any>;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày xuất bản', required: false })
  publishedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày hết hạn', required: false })
  expiresAt?: Date;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Link chia sẻ', required: false })
  shareUrl?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'QR chia sẻ', required: false })
  shareQrUrl?: string;

  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({ description: 'Lượt xem' })
  viewCount: number;

  @ManyToOne(() => UserEntity, (user) => user.invitations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => TemplateEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'templateId' })
  template: TemplateEntity;

  @OneToMany(() => InvitationHostEntity, (host) => host.invitation, { cascade: true })
  hosts: InvitationHostEntity[];

  @OneToMany(() => InvitationEventEntity, (event) => event.invitation, { cascade: true })
  events: InvitationEventEntity[];

  @OneToMany(() => InvitationTimelineEntity, (item) => item.invitation, { cascade: true })
  timelines: InvitationTimelineEntity[];

  @OneToMany(() => InvitationPhotoEntity, (photo) => photo.invitation, { cascade: true })
  photos: InvitationPhotoEntity[];

  @OneToMany(() => InvitationGiftEntity, (gift) => gift.invitation, { cascade: true })
  gifts: InvitationGiftEntity[];

  @OneToMany(() => GuestGroupEntity, (group) => group.invitation, { cascade: true })
  guestGroups: GuestGroupEntity[];

  @OneToMany(() => WishEntity, (wish) => wish.invitation)
  wishes: WishEntity[];

  @OneToMany(() => TableEntity, (table) => table.invitation)
  tables: TableEntity[];

  @OneToMany(() => GuestEntity, (guest) => guest.invitation)
  guests: GuestEntity[];
}
