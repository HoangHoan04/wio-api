import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

/* ============================================================
 * CREATE GUEST
 * ============================================================ */
export class CreateGuestDto {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @IsUUID()
  @IsNotEmpty()
  invitationId: string;

  @ApiPropertyOptional({ description: 'ID bàn tiệc' })
  @IsOptional()
  @IsUUID()
  tableId?: string;

  @ApiProperty({ description: 'Họ và tên khách mời' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ description: 'Danh xưng (Anh, Chị, Bác…)' })
  @IsOptional()
  @IsString()
  salutation?: string;

  @ApiPropertyOptional({ description: 'ID nhóm khách' })
  @IsOptional()
  @IsUUID()
  groupId?: string;

  @ApiPropertyOptional({
    description: 'Mã nhóm khách',
    enum: enumData.GUEST_GROUP,
  })
  @IsOptional()
  @IsEnum(enumData.GUEST_GROUP)
  groupCode?: string;

  @ApiPropertyOptional({ description: 'Khách VIP?' })
  @IsOptional()
  @IsBoolean()
  isVip?: boolean;

  @ApiPropertyOptional({ description: 'Mã mời cá nhân hoá (unique)' })
  @IsOptional()
  @IsString()
  invitationCode?: string;

  @ApiPropertyOptional({ description: 'URL ảnh QR code cá nhân' })
  @IsOptional()
  @IsString()
  qrCodeUrl?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái RSVP',
    enum: enumData.RSVP_STATUS,
  })
  @IsOptional()
  @IsEnum(enumData.RSVP_STATUS)
  rsvpStatus?: string;

  @ApiPropertyOptional({ description: 'Số người đi kèm (kể cả khách)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  attendingCount?: number;

  @ApiPropertyOptional({ description: 'Cần phương tiện di chuyển?' })
  @IsOptional()
  @IsBoolean()
  needsTransport?: boolean;

  @ApiPropertyOptional({ description: 'Lời nhắn khi RSVP' })
  @IsOptional()
  @IsString()
  rsvpNote?: string;

  @ApiPropertyOptional({ description: 'Thời điểm RSVP' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  rsvpAt?: Date;

  @ApiPropertyOptional({ description: 'Thời điểm gửi link thiệp' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  invitedAt?: Date;

  @ApiPropertyOptional({ description: 'Lần đầu khách mở thiệp' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  invitationViewedAt?: Date;
}

/* ============================================================
 * UPDATE GUEST
 * ============================================================ */
export class UpdateGuestDto extends PartialType(CreateGuestDto) {
  @ApiProperty({ description: 'ID khách mời' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

/* ============================================================
 * FILTER
 * ============================================================ */
export class FilterGuestDto {
  @ApiPropertyOptional({ description: 'ID thiệp' })
  @IsOptional()
  @IsUUID()
  invitationId?: string;

  @ApiPropertyOptional({ description: 'ID bàn tiệc' })
  @IsOptional()
  @IsUUID()
  tableId?: string;

  @ApiPropertyOptional({ description: 'Họ và tên khách mời' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Danh xưng' })
  @IsOptional()
  @IsString()
  salutation?: string;

  @ApiPropertyOptional({ description: 'ID nhóm khách' })
  @IsOptional()
  @IsUUID()
  groupId?: string;

  @ApiPropertyOptional({ description: 'Mã nhóm khách' })
  @IsOptional()
  @IsString()
  groupCode?: string;

  @ApiPropertyOptional({ description: 'Khách VIP?' })
  @IsOptional()
  @IsBoolean()
  isVip?: boolean;

  @ApiPropertyOptional({ description: 'Mã mời cá nhân' })
  @IsOptional()
  @IsString()
  invitationCode?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái RSVP',
    enum: enumData.RSVP_STATUS,
  })
  @IsOptional()
  @IsEnum(enumData.RSVP_STATUS)
  rsvpStatus?: string;

  @ApiPropertyOptional({ description: 'Số người đi kèm' })
  @IsOptional()
  @IsInt()
  attendingCount?: number;

  @ApiPropertyOptional({ description: 'Cần đưa đón?' })
  @IsOptional()
  @IsBoolean()
  needsTransport?: boolean;

  @ApiPropertyOptional({ description: 'Ngày RSVP từ' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  rsvpAtFrom?: Date;

  @ApiPropertyOptional({ description: 'Ngày RSVP đến' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  rsvpAtTo?: Date;
}

/* ============================================================
 * PUBLIC — RSVP & IDENTIFY
 * ============================================================ */
export class IdentifyGuestDto {
  @ApiProperty({ description: 'Mã mời cá nhân' })
  @IsString()
  @IsNotEmpty()
  invitationCode: string;
}

export class RsvpGuestDto {
  @ApiProperty({ description: 'Mã mời cá nhân' })
  @IsString()
  @IsNotEmpty()
  invitationCode: string;

  @ApiPropertyOptional({
    description: 'Trạng thái RSVP',
    enum: enumData.RSVP_STATUS,
  })
  @IsOptional()
  @IsEnum(enumData.RSVP_STATUS)
  rsvpStatus?: string;

  @ApiPropertyOptional({ description: 'Số người tham dự' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  attendingCount?: number;

  @ApiPropertyOptional({ description: 'Cần đưa đón?' })
  @IsOptional()
  @IsBoolean()
  needsTransport?: boolean;

  @ApiPropertyOptional({ description: 'Lời nhắn RSVP' })
  @IsOptional()
  @IsString()
  rsvpNote?: string;
}

/* ============================================================
 * IMPORT EXCEL
 * ============================================================ */
export class ImportGuestExcelDto {
  @ApiProperty({ description: 'ID thiệp' })
  @IsUUID()
  @IsNotEmpty()
  invitationId: string;
}

/* ============================================================
 * GENERATE QR
 * ============================================================ */
export class GenerateQrGuestDto {
  @ApiProperty({ description: 'ID khách mời' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

/* ============================================================
 * CREATE MANY
 * ============================================================ */
export class CreateManyGuestsDto {
  @ApiProperty({ description: 'ID thiệp' })
  @IsUUID()
  @IsNotEmpty()
  invitationId: string;

  @ApiProperty({ description: 'Danh sách khách mời', type: [CreateGuestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGuestDto)
  guests: CreateGuestDto[];
}
