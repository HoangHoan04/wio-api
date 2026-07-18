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
import { TableEntity } from './table.entity';
import { TemplateEntity } from './template.entity';
import { UserEntity } from './user.entity';
import { WeddingEventEntity } from './wedding-event.entity';
import { WeddingPhotoEntity } from './wedding-photo.entity';
import { WeddingTimelineEntity } from './wedding-timeline.entity';
import { WishEntity } from './wish.entity';

@Entity('weddings')
@Index('UQ_wedding_slug', ['slug'], {
  unique: true,
  where: `"status" != 'ARCHIVED' AND "isDeleted" = false`,
})
export class WeddingEntity extends BaseEntity {
  // ID người dùng
  @Column({ type: 'uuid', nullable: false })
  @Index()
  @ApiProperty({ description: 'ID User sở hữu' })
  userId: string;

  // ID giao diện
  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'ID Template giao diện', required: false })
  templateId?: string;

  // Đường dẫn tĩnh
  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'URL công khai: /thiep/slug' })
  slug: string;

  // Thứ tự hiển thị
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({
    description: 'Thứ tự hiển thị: groom_first | bride_first',
    required: false,
  })
  displayOrder?: string;

  // Hiển thị ảnh cover
  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Hiển thị ảnh cover' })
  showHeroImage: boolean;

  // Ảnh cover chính
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Ảnh cover chính' })
  heroImageMain?: string;

  // Hiển thị phần giới thiệu
  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Hiển thị phần giới thiệu' })
  showIntro: boolean;

  // Hiển thị album ảnh
  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Hiển thị album ảnh' })
  showGallery: boolean;

  // Bố cục album ảnh
  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Bố cục album ảnh' })
  galleryLayout?: string;

  // Hiển thị thông tin tiệc
  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Hiển thị thông tin tiệc' })
  showParty: boolean;

  // Loại tiệc
  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Loại tiệc' })
  partyType?: string;

  // Thời gian đón khách
  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Thời gian đón khách' })
  receptionWelcomeTime?: string;

  // Hiển thị đếm ngược
  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Hiển thị đếm ngược' })
  showCountdown: boolean;

  // Hiển thị bản đồ
  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Hiển thị bản đồ' })
  showMap: boolean;

  // Hiển thị dress code
  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Hiển thị dress code' })
  showDressCode: boolean;

  // Danh sách dress code
  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Danh sách dress code' })
  dressCodes?: string[];

  // Hiển thị lịch trình
  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Hiển thị lịch trình' })
  showTimeline: boolean;

  // Tiêu đề lịch trình
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Tiêu đề lịch trình' })
  timelineTitle?: string;

  // Hiển thị form RSVP
  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Hiển thị form RSVP' })
  showRsvp: boolean;

  // Loại form RSVP
  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Loại form RSVP' })
  rsvpType?: string;

  // Hiển thị sổ lời chúc
  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Hiển thị sổ lời chúc' })
  showGuestbook: boolean;

  // Sổ lời chúc tĩnh
  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Sổ lời chúc tĩnh' })
  guestbookStatic: boolean;

  // Sổ lời chúc nổi
  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Sổ lời chúc nổi' })
  guestbookFloating: boolean;

  // Hiển thị lời cảm ơn
  @Column({ type: 'boolean', default: true })
  @ApiProperty({ description: 'Hiển thị lời cảm ơn' })
  showThankYou: boolean;

  // Nội dung lời cảm ơn
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Nội dung lời cảm ơn' })
  thankYouText?: string;

  // Thông tin cô dâu chú rể
  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Tên chú rể' })
  groomName: string;

  // Tên ngắn chú rể
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Tên ngắn chú rể' })
  groomShortName?: string;

  // Danh xưng chú rể
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Danh xưng chú rể' })
  groomTitle?: string;

  // Địa chỉ chú rể
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Địa chỉ chú rể' })
  groomAddress?: string;

  // Ngày sinh chú rể
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày sinh chú rể', required: false })
  groomDob?: Date;

  // Danh xưng nhà trai
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Danh xưng nhà trai', required: false })
  groomFamilyTitle?: string;

  // Tên bố chú rể
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Tên bố chú rể', required: false })
  groomFatherName?: string;

  // Tên mẹ chú rể
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Tên mẹ chú rể', required: false })
  groomMotherName?: string;

  // Ảnh chú rể
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Ảnh chú rể', required: false })
  groomPhotoUrl?: string;

  // Tên cô dâu
  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Tên cô dâu' })
  brideName: string;

  // Tên ngắn cô dâu
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Tên ngắn cô dâu' })
  brideShortName?: string;

  // Danh xưng cô dâu
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Danh xưng cô dâu' })
  brideTitle?: string;

  // Địa chỉ cô dâu
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Địa chỉ cô dâu' })
  brideAddress?: string;

  // Ngày sinh cô dâu
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày sinh cô dâu', required: false })
  brideDob?: Date;

  // Danh xưng nhà gái
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Danh xưng nhà gái', required: false })
  brideFamilyTitle?: string;

  // Tên bố cô dâu
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Tên bố cô dâu', required: false })
  brideFatherName?: string;

  // Tên mẹ cô dâu
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Tên mẹ cô dâu', required: false })
  brideMotherName?: string;

  // Ảnh cô dâu
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Ảnh cô dâu', required: false })
  bridePhotoUrl?: string;

  // Lễ ăn hỏi
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Thời gian lễ ăn hỏi', required: false })
  engagementAt?: Date;

  // Địa điểm ăn hỏi
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Nơi tổ chức lễ ăn hỏi', required: false })
  engagementVenue?: string;

  // Địa chỉ ăn hỏi
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Địa chỉ lễ ăn hỏi', required: false })
  engagementAddress?: string;

  // Link bản đồ ăn hỏi
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Đường dẫn bản đồ lễ ăn hỏi', required: false })
  engagementMapsUrl?: string;

  // Lễ cưới
  @Column({ type: 'timestamptz', nullable: false })
  @ApiProperty({ description: 'Thời gian lễ cưới' })
  ceremonyAt: Date;

  // Địa điểm làm lễ
  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Nơi tổ chức lễ cưới' })
  ceremonyVenue: string;

  // Địa chỉ làm lễ
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Địa chỉ lễ cưới', required: false })
  ceremonyAddress?: string;

  // Link bản đồ làm lễ
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Đường dẫn bản đồ lễ cưới', required: false })
  ceremonyMapsUrl?: string;

  // Vĩ độ làm lễ
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @ApiProperty({ description: 'Vĩ độ lễ cưới', required: false })
  ceremonyLat?: number;

  // Kinh độ làm lễ
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @ApiProperty({ description: 'Kinh độ lễ cưới', required: false })
  ceremonyLng?: number;

  // Tiệc cưới
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Thời gian tiệc cưới', required: false })
  receptionAt?: Date;

  // Địa điểm tiệc
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Nơi tổ chức tiệc cưới', required: false })
  receptionVenue?: string;

  // Địa chỉ tiệc
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Địa chỉ tiệc cưới', required: false })
  receptionAddress?: string;

  // Link bản đồ tiệc
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Đường dẫn bản đồ tiệc cưới', required: false })
  receptionMapsUrl?: string;

  // Vĩ độ tiệc
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @ApiProperty({ description: 'Vĩ độ tiệc cưới', required: false })
  receptionLat?: number;

  // Kinh độ tiệc
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @ApiProperty({ description: 'Kinh độ tiệc cưới', required: false })
  receptionLng?: number;

  // Nội dung thiệp
  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'Lời mời viết tay hoặc AI sinh',
    required: false,
  })
  // Lời mời
  @ApiProperty({ description: 'Lời mời' })
  invitationText?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'Câu chuyện tình yêu hiển thị trên thiệp',
    required: false,
  })
  // Câu chuyện tình yêu
  @ApiProperty({ description: 'Câu chuyện tình yêu' })
  loveStory?: string;

  // Hashtag
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Hashtag đám cưới', required: false })
  hashtag?: string;

  // Nhạc nền
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Đường dẫn nhạc nền', required: false })
  musicUrl?: string;

  // Loại nhạc
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Loại nhạc', required: false })
  musicType?: string;

  // Tự động phát nhạc
  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Tự động phát nhạc' })
  musicAutoplay?: boolean;

  // Tên bài hát
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Tên bài hát' })
  musicName?: string;

  // Thanh toán / Mừng cưới
  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Số tài khoản chú rể' })
  groomBankAccount?: string;

  // Tên ngân hàng chú rể
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Tên ngân hàng chú rể' })
  groomBankName?: string;

  // Tên chủ tài khoản chú rể
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Tên chủ tài khoản chú rể' })
  groomBankOwner?: string;

  // Ảnh QR chú rể
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Ảnh QR chú rể' })
  groomQrUrl?: string;

  // Số tài khoản cô dâu
  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Số tài khoản cô dâu' })
  brideBankAccount?: string;

  // Tên ngân hàng cô dâu
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Tên ngân hàng cô dâu' })
  brideBankName?: string;

  // Tên chủ tài khoản cô dâu
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Tên chủ tài khoản cô dâu' })
  brideBankOwner?: string;

  // Ảnh QR cô dâu
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Ảnh QR cô dâu' })
  brideQrUrl?: string;

  // Trạng thái
  @Column({ type: 'varchar', length: 50, nullable: false })
  @Index()
  @ApiProperty({ description: 'Trạng thái' })
  status: string;

  // Ngày xuất bản
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày xuất bản', required: false })
  publishedAt?: Date;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    description: 'URL thiệp đã rút gọn / chia sẻ',
    required: false,
  })
  // Link chia sẻ
  @ApiProperty({ description: 'Link chia sẻ' })
  shareUrl?: string;

  // QR chia sẻ
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'URL ảnh QR poster chia sẻ', required: false })
  shareQrUrl?: string;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({
    description: 'Hết hạn sau bao lâu tùy gói dịch vụ',
    required: false,
  })
  // Ngày hết hạn
  @ApiProperty({ description: 'Ngày hết hạn' })
  expiresAt?: Date;

  // Mối quan hệ vật lý (Relationships)
  @ManyToOne(() => UserEntity, (user) => user.weddings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @ApiProperty({ description: 'User' })
  user: UserEntity;

  // Template
  @ManyToOne(() => TemplateEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'templateId' })
  @ApiProperty({ description: 'Template' })
  template: TemplateEntity;

  // Wishes
  @OneToMany(() => WishEntity, (wish) => wish.wedding)
  @ApiProperty({ description: 'Wishes' })
  wishes: WishEntity[];

  // Danh sách ảnh
  @OneToMany(() => WeddingPhotoEntity, (photo) => photo.wedding)
  @ApiProperty({ description: 'Danh sách ảnh' })
  photos: WeddingPhotoEntity[];

  // Danh sách sự kiện
  @OneToMany(() => WeddingEventEntity, (event) => event.wedding, {
    cascade: true,
  })
  @ApiProperty({ description: 'Danh sách sự kiện' })
  events: WeddingEventEntity[];

  // Danh sách mốc thời gian
  @OneToMany(() => WeddingTimelineEntity, (timeline) => timeline.wedding, {
    cascade: true,
  })
  @ApiProperty({ description: 'Danh sách mốc thời gian' })
  timelines: WeddingTimelineEntity[];

  // Tables
  @OneToMany(() => TableEntity, (table) => table.wedding)
  @ApiProperty({ description: 'Tables' })
  tables: TableEntity[];

  // Guests
  @OneToMany(() => GuestEntity, (guest) => guest.wedding)
  @ApiProperty({ description: 'Guests' })
  guests: GuestEntity[];
}
