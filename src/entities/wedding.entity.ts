import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MusicType, WeddingStatus } from './enums';

// Thông tin đám cưới chính - trung tâm của toàn hệ thống
@Entity('weddings')
@Index('UQ_wedding_slug', ['slug'], {
  unique: true,
  where: `"status" != 'archived' AND "isDeleted" = false`,
})
export class WeddingEntity extends BaseEntity {
  @ApiProperty({ description: 'ID User sở hữu' })
  @Column({ type: 'uuid', nullable: false })
  @Index()
  userId: string;

  @ApiProperty({ description: 'ID Template giao diện', required: false })
  @Column({ type: 'uuid', nullable: true })
  templateId: string;

  @ApiProperty({ description: 'URL công khai: /thiep/slug' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  slug: string;

  // --- Thông tin cô dâu chú rể ---
  @ApiProperty({ description: 'Tên chú rể' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  groomName: string;

  @ApiProperty({ description: 'Ngày sinh chú rể', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  groomDob: Date;

  @ApiProperty({ description: 'Tên bố chú rể', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  groomFatherName: string;

  @ApiProperty({ description: 'Tên mẹ chú rể', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  groomMotherName: string;

  @ApiProperty({ description: 'Ảnh chú rể', required: false })
  @Column({ type: 'text', nullable: true })
  groomPhotoUrl: string;

  @ApiProperty({ description: 'Tên cô dâu' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  brideName: string;

  @ApiProperty({ description: 'Ngày sinh cô dâu', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  brideDob: Date;

  @ApiProperty({ description: 'Tên bố cô dâu', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  brideFatherName: string;

  @ApiProperty({ description: 'Tên mẹ cô dâu', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  brideMotherName: string;

  @ApiProperty({ description: 'Ảnh cô dâu', required: false })
  @Column({ type: 'text', nullable: true })
  bridePhotoUrl: string;

  // --- Lễ ăn hỏi ---
  @ApiProperty({ description: 'Thời gian lễ ăn hỏi', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  engagementAt: Date;

  @ApiProperty({ description: 'Nơi tổ chức lễ ăn hỏi', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  engagementVenue: string;

  @ApiProperty({ description: 'Địa chỉ lễ ăn hỏi', required: false })
  @Column({ type: 'text', nullable: true })
  engagementAddress: string;

  @ApiProperty({ description: 'Đường dẫn bản đồ lễ ăn hỏi', required: false })
  @Column({ type: 'text', nullable: true })
  engagementMapsUrl: string;

  // --- Lễ cưới ---
  @ApiProperty({ description: 'Thời gian lễ cưới' })
  @Column({ type: 'timestamptz', nullable: false })
  ceremonyAt: Date;

  @ApiProperty({ description: 'Nơi tổ chức lễ cưới' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  ceremonyVenue: string;

  @ApiProperty({ description: 'Địa chỉ lễ cưới', required: false })
  @Column({ type: 'text', nullable: true })
  ceremonyAddress: string;

  @ApiProperty({ description: 'Đường dẫn bản đồ lễ cưới', required: false })
  @Column({ type: 'text', nullable: true })
  ceremonyMapsUrl: string;

  @ApiProperty({ description: 'Vĩ độ lễ cưới', required: false })
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  ceremonyLat: number;

  @ApiProperty({ description: 'Kinh độ lễ cưới', required: false })
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  ceremonyLng: number;

  // --- Tiệc cưới ---
  @ApiProperty({ description: 'Thời gian tiệc cưới', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  receptionAt: Date;

  @ApiProperty({ description: 'Nơi tổ chức tiệc cưới', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  receptionVenue: string;

  @ApiProperty({ description: 'Địa chỉ tiệc cưới', required: false })
  @Column({ type: 'text', nullable: true })
  receptionAddress: string;

  @ApiProperty({ description: 'Đường dẫn bản đồ tiệc cưới', required: false })
  @Column({ type: 'text', nullable: true })
  receptionMapsUrl: string;

  @ApiProperty({ description: 'Vĩ độ tiệc cưới', required: false })
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  receptionLat: number;

  @ApiProperty({ description: 'Kinh độ tiệc cưới', required: false })
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  receptionLng: number;

  // --- Nội dung thiệp ---
  @ApiProperty({
    description: 'Lời mời viết tay hoặc AI sinh',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  invitationText: string;

  @ApiProperty({
    description: 'Câu chuyện tình yêu hiển thị trên thiệp',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  loveStory: string;

  @ApiProperty({ description: 'Hashtag đám cưới', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  hashtag: string;

  // --- Nhạc nền ---
  @ApiProperty({ description: 'Đường dẫn nhạc nền', required: false })
  @Column({ type: 'text', nullable: true })
  musicUrl: string;

  @ApiProperty({ description: 'Loại nhạc', enum: MusicType, required: false })
  @Column({ type: 'enum', enum: MusicType, nullable: true })
  musicType: MusicType;

  @ApiProperty({ description: 'Tự động phát nhạc' })
  @Column({ type: 'boolean', default: false, nullable: false })
  musicAutoplay: boolean;

  // --- Thanh toán / Mừng cưới ---
  @ApiProperty({ description: 'Số tài khoản ngân hàng', required: false })
  @Column({ type: 'varchar', length: 50, nullable: true })
  bankAccountNumber: string;

  @ApiProperty({ description: 'Tên ngân hàng', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankName: string;

  @ApiProperty({ description: 'Tên chủ tài khoản', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  bankAccountName: string;

  @ApiProperty({ description: 'Nội dung chuyển khoản mẫu', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  bankTransferNote: string;

  @ApiProperty({ description: 'URL ảnh QR sinh tự động', required: false })
  @Column({ type: 'text', nullable: true })
  vietqrUrl: string;

  // --- Trạng thái ---
  @ApiProperty({ description: 'Trạng thái', enum: WeddingStatus })
  @Column({
    type: 'enum',
    enum: WeddingStatus,
    default: WeddingStatus.DRAFT,
    nullable: false,
  })
  @Index()
  status: WeddingStatus;

  @ApiProperty({ description: 'Ngày xuất bản', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  publishedAt: Date;

  @ApiProperty({
    description: 'URL thiệp đã rút gọn / chia sẻ',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  shareUrl: string;

  @ApiProperty({ description: 'URL ảnh QR poster chia sẻ', required: false })
  @Column({ type: 'text', nullable: true })
  shareQrUrl: string;

  @ApiProperty({
    description: 'Hết hạn sau bao lâu tùy gói dịch vụ',
    required: false,
  })
  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date;
}
