import { normalizeEventKey } from '@/utils/invitation.utils';
import { enumData } from '@/common/constanst/enumData';
import { IsEnumCode } from '@/common/decorators';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';

/* ============================================================
 * NESTED — HOST
 * ============================================================ */
export class InvitationHostDto {
  @ApiPropertyOptional({ description: 'ID host (nếu update)' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ description: 'Vai trò', enum: enumData.HOST_ROLE })
  @IsNotEmpty()
  @IsEnumCode(enumData.HOST_ROLE)
  role: string;

  @ApiProperty({ description: 'Họ và tên đầy đủ' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiPropertyOptional({ description: 'Tên ngắn' })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiPropertyOptional({ description: 'URL ảnh' })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional({ description: 'MXH' })
  @IsOptional()
  @IsObject()
  social?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Thứ tự' })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

/* ============================================================
 * NESTED — EVENT
 * ============================================================ */
export class InvitationEventDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ description: 'Loại sự kiện', enum: enumData.EVENT_KEY })
  @IsNotEmpty()
  @Transform(({ value }) => normalizeEventKey(value))
  @IsEnumCode(enumData.EVENT_KEY)
  eventKey: string;

  @ApiProperty({ description: 'Tiêu đề' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Thời gian bắt đầu' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startsAt?: Date;

  @ApiPropertyOptional({ description: 'Thời gian kết thúc' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endsAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  venue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mapsUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dressCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

/* ============================================================
 * NESTED — GIFT
 * ============================================================ */
export class InvitationGiftDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ description: 'Nhãn tài khoản' })
  @IsNotEmpty()
  @IsString()
  label: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accountOwner?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  qrUrl?: string;

  @ApiPropertyOptional({
    description: 'Bên nhận quà',
    enum: enumData.GUEST_SIDE,
  })
  @IsOptional()
  @IsEnumCode(enumData.GUEST_SIDE)
  side?: string;

  @ApiPropertyOptional({ description: 'Mã BIN ngân hàng' })
  @IsOptional()
  @IsString()
  bankBin?: string;

  @ApiPropertyOptional({ description: 'Hiển thị trên thiệp' })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

/* ============================================================
 * NESTED — TIMELINE
 * ============================================================ */
export class InvitationTimelineDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  eventId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timeLabel?: string;

  @ApiProperty({ description: 'Tiêu đề mốc' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

/* ============================================================
 * NESTED — PHOTO
 * ============================================================ */
export class InvitationPhotoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ description: 'URL ảnh' })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  storageKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ enum: enumData.PHOTO_KIND })
  @IsOptional()
  @IsEnumCode(enumData.PHOTO_KIND)
  kind?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

/* ============================================================
 * NESTED — GUEST GROUP
 * ============================================================ */
export class GuestGroupDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ enum: enumData.GUEST_SIDE })
  @IsOptional()
  @IsEnumCode(enumData.GUEST_SIDE)
  side?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

/* ============================================================
 * NESTED — WEDDING INFO (cô dâu / chú rể)
 * ============================================================ */
export class WeddingInfoDto {
  @ApiProperty({ description: 'Tên cô dâu' })
  @IsNotEmpty()
  @IsString()
  brideName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brideShortName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bridePhotoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brideFatherName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brideMotherName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brideBio?: string;

  @ApiPropertyOptional({ description: 'MXH / extras cô dâu (title, familyTitle, address…)' })
  @IsOptional()
  @IsObject()
  brideSocial?: Record<string, string>;

  @ApiProperty({ description: 'Tên chú rể' })
  @IsNotEmpty()
  @IsString()
  groomName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  groomShortName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  groomPhotoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  groomFatherName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  groomMotherName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  groomBio?: string;

  @ApiPropertyOptional({ description: 'MXH / extras chú rể (title, familyTitle, address…)' })
  @IsOptional()
  @IsObject()
  groomSocial?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  loveStartedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  loveStory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hashtag?: string;
}

/* ============================================================
 * CREATE INVITATION
 * ============================================================ */
export class CreateInvitationDto {
  @ApiPropertyOptional({ description: 'ID user (admin tạo hộ)' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'ID template' })
  @IsOptional()
  @IsUUID()
  templateId?: string;

  // ---- Phân loại ----
  @ApiProperty({ description: 'Chế độ thiết kế', enum: enumData.DESIGN_MODE })
  @IsNotEmpty()
  @IsEnumCode(enumData.DESIGN_MODE)
  designMode: string;

  @ApiPropertyOptional({
    description: 'Luồng tạo thiệp',
    enum: enumData.CREATED_VIA,
  })
  @IsOptional()
  @IsEnumCode(enumData.CREATED_VIA)
  createdVia?: string;

  @ApiProperty({ description: 'Phong cách cưới', enum: enumData.WEDDING_THEME })
  @IsNotEmpty()
  @IsEnumCode(enumData.WEDDING_THEME)
  weddingTheme: string;

  // ---- Nội dung ----
  @ApiProperty({ description: 'Tiêu đề thiệp' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Slug công khai' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  invitationText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thankYouText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heroImageUrl?: string;

  @ApiPropertyOptional({ description: 'Bật/tắt section + extras' })
  @IsOptional()
  @IsObject()
  sectionConfig?: Record<string, any>;

  @ApiPropertyOptional({ description: 'ID nhạc nền' })
  @IsOptional()
  @IsUUID()
  musicId?: string;

  @ApiPropertyOptional({ description: 'Config nhạc' })
  @IsOptional()
  @IsObject()
  musicConfig?: { autoplay?: boolean; loop?: boolean; volume?: number };

  // ---- Chỉ dùng cho CANVA ----
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  customDesign?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Version schema design document' })
  @IsOptional()
  @IsInt()
  designSchemaVersion?: number;

  // ---- Chỉ dùng cho AI_SCAN ----
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  aiGeneratedMeta?: Record<string, any>;

  // ---- SEO ----
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seoDescription?: string;

  // ---- Nested ----
  @ApiPropertyOptional({ type: WeddingInfoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => WeddingInfoDto)
  weddingInfo?: WeddingInfoDto;

  @ApiPropertyOptional({ type: [InvitationHostDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvitationHostDto)
  hosts?: InvitationHostDto[];

  @ApiPropertyOptional({ type: [InvitationEventDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvitationEventDto)
  events?: InvitationEventDto[];

  @ApiPropertyOptional({ type: [InvitationGiftDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvitationGiftDto)
  gifts?: InvitationGiftDto[];

  @ApiPropertyOptional({ type: [InvitationTimelineDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvitationTimelineDto)
  timelines?: InvitationTimelineDto[];

  @ApiPropertyOptional({ type: [InvitationPhotoDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvitationPhotoDto)
  photos?: InvitationPhotoDto[];

  @ApiPropertyOptional({ type: [GuestGroupDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestGroupDto)
  guestGroups?: GuestGroupDto[];
}

/* ============================================================
 * UPDATE INVITATION
 * ============================================================ */
export class UpdateInvitationDto extends PartialType(CreateInvitationDto) {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slugReason?: string;
}

/* ============================================================
 * FILTER
 * ============================================================ */
export class FilterInvitationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  templateId?: string;

  @ApiPropertyOptional({ enum: enumData.DESIGN_MODE })
  @IsOptional()
  @IsEnumCode(enumData.DESIGN_MODE)
  designMode?: string;

  @ApiPropertyOptional({ enum: enumData.WEDDING_THEME })
  @IsOptional()
  @IsEnumCode(enumData.WEDDING_THEME)
  weddingTheme?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ enum: enumData.INVITATION_STATUS })
  @IsOptional()
  @IsEnumCode(enumData.INVITATION_STATUS)
  status?: string;
}

/* ============================================================
 * ADMIN
 * ============================================================ */
export class AdminForceResetSlugDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  invitationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  newSlug: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reason: string;
}

export class CheckSlugDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  slug: string;
}
