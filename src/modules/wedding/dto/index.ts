import { MusicType, WeddingStatus } from '@/entities/enums';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateWeddingDto {
  @ApiProperty({ description: 'ID User sở hữu' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'ID Template giao diện', required: false })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiProperty({ description: 'URL công khai: /thiep/slug (Unique)' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Tên chú rể' })
  @IsNotEmpty()
  @IsString()
  groomName: string;

  @ApiProperty({ description: 'Ngày sinh chú rể', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  groomDob?: Date;

  @ApiProperty({ description: 'Danh xưng nhà trai', required: false })
  @IsOptional()
  @IsString()
  groomFamilyTitle?: string;

  @ApiProperty({ description: 'Tên bố chú rể', required: false })
  @IsOptional()
  @IsString()
  groomFatherName?: string;

  @ApiProperty({ description: 'Tên mẹ chú rể', required: false })
  @IsOptional()
  @IsString()
  groomMotherName?: string;

  @ApiProperty({ description: 'Ảnh chú rể', required: false })
  @IsOptional()
  @IsString()
  groomPhotoUrl?: string;

  @ApiProperty({ description: 'Tên cô dâu' })
  @IsNotEmpty()
  @IsString()
  brideName: string;

  @ApiProperty({ description: 'Ngày sinh cô dâu', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  brideDob?: Date;

  @ApiProperty({ description: 'Danh xưng nhà gái', required: false })
  @IsOptional()
  @IsString()
  brideFamilyTitle?: string;

  @ApiProperty({ description: 'Tên bố cô dâu', required: false })
  @IsOptional()
  @IsString()
  brideFatherName?: string;

  @ApiProperty({ description: 'Tên mẹ cô dâu', required: false })
  @IsOptional()
  @IsString()
  brideMotherName?: string;

  @ApiProperty({ description: 'Ảnh cô dâu', required: false })
  @IsOptional()
  @IsString()
  bridePhotoUrl?: string;

  @ApiProperty({ description: 'Thời gian lễ ăn hỏi', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  engagementAt?: Date;

  @ApiProperty({ description: 'Nơi tổ chức lễ ăn hỏi', required: false })
  @IsOptional()
  @IsString()
  engagementVenue?: string;

  @ApiProperty({ description: 'Địa chỉ lễ ăn hỏi', required: false })
  @IsOptional()
  @IsString()
  engagementAddress?: string;

  @ApiProperty({ description: 'Đường dẫn bản đồ lễ ăn hỏi', required: false })
  @IsOptional()
  @IsString()
  engagementMapsUrl?: string;

  @ApiProperty({ description: 'Thời gian lễ cưới' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  ceremonyAt: Date;

  @ApiProperty({ description: 'Nơi tổ chức lễ cưới' })
  @IsNotEmpty()
  @IsString()
  ceremonyVenue: string;

  @ApiProperty({ description: 'Địa chỉ lễ cưới', required: false })
  @IsOptional()
  @IsString()
  ceremonyAddress?: string;

  @ApiProperty({ description: 'Đường dẫn bản đồ lễ cưới', required: false })
  @IsOptional()
  @IsString()
  ceremonyMapsUrl?: string;

  @ApiProperty({ description: 'Vĩ độ lễ cưới', required: false })
  @IsOptional()
  @IsNumber()
  ceremonyLat?: number;

  @ApiProperty({ description: 'Kinh độ lễ cưới', required: false })
  @IsOptional()
  @IsNumber()
  ceremonyLng?: number;

  @ApiProperty({ description: 'Thời gian tiệc cưới', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  receptionAt?: Date;

  @ApiProperty({ description: 'Nơi tổ chức tiệc cưới', required: false })
  @IsOptional()
  @IsString()
  receptionVenue?: string;

  @ApiProperty({ description: 'Địa chỉ tiệc cưới', required: false })
  @IsOptional()
  @IsString()
  receptionAddress?: string;

  @ApiProperty({ description: 'Đường dẫn bản đồ tiệc cưới', required: false })
  @IsOptional()
  @IsString()
  receptionMapsUrl?: string;

  @ApiProperty({ description: 'Vĩ độ tiệc cưới', required: false })
  @IsOptional()
  @IsNumber()
  receptionLat?: number;

  @ApiProperty({ description: 'Kinh độ tiệc cưới', required: false })
  @IsOptional()
  @IsNumber()
  receptionLng?: number;

  @ApiProperty({
    description: 'Lời mời viết tay hoặc AI sinh',
    required: false,
  })
  @IsOptional()
  @IsString()
  invitationText?: string;

  @ApiProperty({
    description: 'Câu chuyện tình yêu hiển thị trên thiệp',
    required: false,
  })
  @IsOptional()
  @IsString()
  loveStory?: string;

  @ApiProperty({ description: 'Hashtag đám cưới', required: false })
  @IsOptional()
  @IsString()
  hashtag?: string;

  @ApiProperty({ description: 'Đường dẫn nhạc nền', required: false })
  @IsOptional()
  @IsString()
  musicUrl?: string;

  @ApiProperty({ description: 'Loại nhạc', enum: MusicType, required: false })
  @IsOptional()
  @IsEnum(MusicType)
  musicType?: MusicType;

  @ApiProperty({ description: 'Tự động phát nhạc' })
  @IsNotEmpty()
  @IsBoolean()
  musicAutoplay: boolean;

  @ApiProperty({ description: 'Số tài khoản ngân hàng', required: false })
  @IsOptional()
  @IsString()
  bankAccountNumber?: string;

  @ApiProperty({ description: 'Tên ngân hàng', required: false })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({ description: 'Tên chủ tài khoản', required: false })
  @IsOptional()
  @IsString()
  bankAccountName?: string;

  @ApiProperty({ description: 'Nội dung chuyển khoản mẫu', required: false })
  @IsOptional()
  @IsString()
  bankTransferNote?: string;

  @ApiProperty({ description: 'URL ảnh QR sinh tự động', required: false })
  @IsOptional()
  @IsString()
  vietqrUrl?: string;

  @ApiProperty({ description: 'Trạng thái', enum: WeddingStatus })
  @IsNotEmpty()
  @IsEnum(WeddingStatus)
  status: WeddingStatus;

  @ApiProperty({ description: 'Ngày xuất bản', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publishedAt?: Date;

  @ApiProperty({
    description: 'Hết hạn sau bao lâu tùy gói dịch vụ',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  displayOrder?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showHeroImage?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  heroImageMain?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showIntro?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showGallery?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  galleryLayout?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showParty?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  partyType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  receptionWelcomeTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showCountdown?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showMap?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showDressCode?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  dressCodes?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showTimeline?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  timelineTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showRsvp?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rsvpType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showGuestbook?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  guestbookStatic?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  guestbookFloating?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showThankYou?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  thankYouText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomShortName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideShortName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomBankAccount?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomBankName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomBankOwner?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomQrUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideBankAccount?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideBankName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideBankOwner?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideQrUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  musicName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  events?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  timelines?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  gallery?: string[];
}

export class UpdateWeddingDto extends PartialType(CreateWeddingDto) {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Lý do thay đổi slug', required: false })
  @IsOptional()
  @IsString()
  slugReason?: string;
}

export class FilterWeddingDto {
  @ApiProperty({ description: 'ID User sở hữu', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'ID Template giao diện', required: false })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiProperty({
    description: 'URL công khai: /thiep/slug (Unique)',
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ description: 'Tên chú rể', required: false })
  @IsOptional()
  @IsString()
  groomName?: string;

  @ApiProperty({ description: 'Ngày sinh chú rể', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  groomDob?: Date;

  @ApiProperty({ description: 'Tên bố chú rể', required: false })
  @IsOptional()
  @IsString()
  groomFatherName?: string;

  @ApiProperty({ description: 'Tên mẹ chú rể', required: false })
  @IsOptional()
  @IsString()
  groomMotherName?: string;

  @ApiProperty({ description: 'Ảnh chú rể', required: false })
  @IsOptional()
  @IsString()
  groomPhotoUrl?: string;

  @ApiProperty({ description: 'Tên cô dâu', required: false })
  @IsOptional()
  @IsString()
  brideName?: string;

  @ApiProperty({ description: 'Ngày sinh cô dâu', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  brideDob?: Date;

  @ApiProperty({ description: 'Tên bố cô dâu', required: false })
  @IsOptional()
  @IsString()
  brideFatherName?: string;

  @ApiProperty({ description: 'Tên mẹ cô dâu', required: false })
  @IsOptional()
  @IsString()
  brideMotherName?: string;

  @ApiProperty({ description: 'Ảnh cô dâu', required: false })
  @IsOptional()
  @IsString()
  bridePhotoUrl?: string;

  @ApiProperty({ description: 'Thời gian lễ ăn hỏi', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  engagementAt?: Date;

  @ApiProperty({ description: 'Nơi tổ chức lễ ăn hỏi', required: false })
  @IsOptional()
  @IsString()
  engagementVenue?: string;

  @ApiProperty({ description: 'Địa chỉ lễ ăn hỏi', required: false })
  @IsOptional()
  @IsString()
  engagementAddress?: string;

  @ApiProperty({ description: 'Đường dẫn bản đồ lễ ăn hỏi', required: false })
  @IsOptional()
  @IsString()
  engagementMapsUrl?: string;

  @ApiProperty({ description: 'Thời gian lễ cưới', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  ceremonyAt?: Date;

  @ApiProperty({ description: 'Nơi tổ chức lễ cưới', required: false })
  @IsOptional()
  @IsString()
  ceremonyVenue?: string;

  @ApiProperty({ description: 'Địa chỉ lễ cưới', required: false })
  @IsOptional()
  @IsString()
  ceremonyAddress?: string;

  @ApiProperty({ description: 'Đường dẫn bản đồ lễ cưới', required: false })
  @IsOptional()
  @IsString()
  ceremonyMapsUrl?: string;

  @ApiProperty({ description: 'Vĩ độ lễ cưới', required: false })
  @IsOptional()
  @IsNumber()
  ceremonyLat?: number;

  @ApiProperty({ description: 'Kinh độ lễ cưới', required: false })
  @IsOptional()
  @IsNumber()
  ceremonyLng?: number;

  @ApiProperty({ description: 'Thời gian tiệc cưới', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  receptionAt?: Date;

  @ApiProperty({ description: 'Nơi tổ chức tiệc cưới', required: false })
  @IsOptional()
  @IsString()
  receptionVenue?: string;

  @ApiProperty({ description: 'Địa chỉ tiệc cưới', required: false })
  @IsOptional()
  @IsString()
  receptionAddress?: string;

  @ApiProperty({ description: 'Đường dẫn bản đồ tiệc cưới', required: false })
  @IsOptional()
  @IsString()
  receptionMapsUrl?: string;

  @ApiProperty({ description: 'Vĩ độ tiệc cưới', required: false })
  @IsOptional()
  @IsNumber()
  receptionLat?: number;

  @ApiProperty({ description: 'Kinh độ tiệc cưới', required: false })
  @IsOptional()
  @IsNumber()
  receptionLng?: number;

  @ApiProperty({
    description: 'Lời mời viết tay hoặc AI sinh',
    required: false,
  })
  @IsOptional()
  @IsString()
  invitationText?: string;

  @ApiProperty({
    description: 'Câu chuyện tình yêu hiển thị trên thiệp',
    required: false,
  })
  @IsOptional()
  @IsString()
  loveStory?: string;

  @ApiProperty({ description: 'Hashtag đám cưới', required: false })
  @IsOptional()
  @IsString()
  hashtag?: string;

  @ApiProperty({ description: 'Đường dẫn nhạc nền', required: false })
  @IsOptional()
  @IsString()
  musicUrl?: string;

  @ApiProperty({ description: 'Loại nhạc', enum: MusicType, required: false })
  @IsOptional()
  @IsEnum(MusicType)
  musicType?: MusicType;

  @ApiProperty({ description: 'Tự động phát nhạc', required: false })
  @IsOptional()
  @IsBoolean()
  musicAutoplay?: boolean;

  @ApiProperty({ description: 'Số tài khoản ngân hàng', required: false })
  @IsOptional()
  @IsString()
  bankAccountNumber?: string;

  @ApiProperty({ description: 'Tên ngân hàng', required: false })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({ description: 'Tên chủ tài khoản', required: false })
  @IsOptional()
  @IsString()
  bankAccountName?: string;

  @ApiProperty({ description: 'Nội dung chuyển khoản mẫu', required: false })
  @IsOptional()
  @IsString()
  bankTransferNote?: string;

  @ApiProperty({ description: 'URL ảnh QR sinh tự động', required: false })
  @IsOptional()
  @IsString()
  vietqrUrl?: string;

  @ApiProperty({
    description: 'Trạng thái',
    enum: WeddingStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(WeddingStatus)
  status?: WeddingStatus;

  @ApiProperty({ description: 'Ngày xuất bản', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publishedAt?: Date;

  @ApiProperty({
    description: 'Hết hạn sau bao lâu tùy gói dịch vụ',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  displayOrder?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showHeroImage?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  heroImageMain?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showIntro?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showGallery?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  galleryLayout?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showParty?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  partyType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  receptionWelcomeTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showCountdown?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showMap?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showDressCode?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  dressCodes?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showTimeline?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  timelineTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showRsvp?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rsvpType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showGuestbook?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  guestbookStatic?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  guestbookFloating?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showThankYou?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  thankYouText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomShortName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideShortName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomBankAccount?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomBankName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomBankOwner?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomQrUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideBankAccount?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideBankName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideBankOwner?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brideQrUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  musicName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  events?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  timelines?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  gallery?: string[];
}


export class AdminForceResetSlugDto {
  @ApiProperty({ description: 'ID đám cưới cần reset slug' })
  @IsNotEmpty()
  @IsUUID()
  weddingId: string;

  @ApiProperty({ description: 'Slug mới muốn đặt' })
  @IsNotEmpty()
  @IsString()
  newSlug: string;

  @ApiProperty({ description: 'Lý do thay đổi slug (bắt buộc)' })
  @IsNotEmpty()
  @IsString()
  reason: string;
}
