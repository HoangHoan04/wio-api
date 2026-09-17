import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

/* ============================================================
 * CREATE
 * ============================================================ */
export class CreateNotificationDto {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @IsUUID()
  @IsNotEmpty()
  invitationId: string;

  @ApiPropertyOptional({ description: 'ID khách mời (null = broadcast)' })
  @IsOptional()
  @IsUUID()
  guestId?: string;

  @ApiProperty({ description: 'Kênh gửi', enum: enumData.NOTIF_CHANNEL })
  @IsNotEmpty()
  @IsEnum(enumData.NOTIF_CHANNEL)
  channel: string;

  @ApiProperty({ description: 'Loại thông báo', enum: enumData.NOTIF_TYPE })
  @IsNotEmpty()
  @IsEnum(enumData.NOTIF_TYPE)
  type: string;

  @ApiPropertyOptional({ description: 'Tiêu đề email' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  subject?: string;

  @ApiProperty({ description: 'Nội dung thông báo' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Trạng thái gửi',
    enum: enumData.NOTIF_STATUS,
    default: enumData.NOTIF_STATUS.PENDING.code,
  })
  @IsOptional()
  @IsEnum(enumData.NOTIF_STATUS)
  status?: string;

  @ApiProperty({ description: 'Thời gian lên lịch gửi' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  scheduledAt: Date;

  @ApiPropertyOptional({ description: 'Thời gian đã gửi' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  sentAt?: Date;

  @ApiPropertyOptional({ description: 'Lý do thất bại' })
  @IsOptional()
  @IsString()
  failedReason?: string;

  @ApiPropertyOptional({ description: 'Nhà cung cấp gửi' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  provider?: string;

  @ApiPropertyOptional({ description: 'Message ID từ provider' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  providerMsgId?: string;
}

/* ============================================================
 * UPDATE
 * ============================================================ */
export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @ApiProperty({ description: 'ID thông báo' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

/* ============================================================
 * FILTER
 * ============================================================ */
export class FilterNotificationDto {
  @ApiPropertyOptional({ description: 'ID thiệp cưới' })
  @IsOptional()
  @IsUUID()
  invitationId?: string;

  @ApiPropertyOptional({ description: 'ID khách mời' })
  @IsOptional()
  @IsUUID()
  guestId?: string;

  @ApiPropertyOptional({
    description: 'Kênh gửi',
    enum: enumData.NOTIF_CHANNEL,
  })
  @IsOptional()
  @IsEnum(enumData.NOTIF_CHANNEL)
  channel?: string;

  @ApiPropertyOptional({
    description: 'Loại thông báo',
    enum: enumData.NOTIF_TYPE,
  })
  @IsOptional()
  @IsEnum(enumData.NOTIF_TYPE)
  type?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái gửi',
    enum: enumData.NOTIF_STATUS,
  })
  @IsOptional()
  @IsEnum(enumData.NOTIF_STATUS)
  status?: string;

  @ApiPropertyOptional({ description: 'Lịch gửi từ' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledFrom?: Date;

  @ApiPropertyOptional({ description: 'Lịch gửi đến' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledTo?: Date;

  @ApiPropertyOptional({ description: 'Đã gửi từ' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  sentFrom?: Date;

  @ApiPropertyOptional({ description: 'Đã gửi đến' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  sentTo?: Date;
}

/* ============================================================
 * BROADCAST — gửi cho toàn bộ khách mời
 * ============================================================ */
export class BroadcastNotificationDto {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @IsUUID()
  @IsNotEmpty()
  invitationId: string;

  @ApiProperty({ description: 'Kênh gửi', enum: enumData.NOTIF_CHANNEL })
  @IsNotEmpty()
  @IsEnum(enumData.NOTIF_CHANNEL)
  channel: string;

  @ApiProperty({ description: 'Loại thông báo', enum: enumData.NOTIF_TYPE })
  @IsNotEmpty()
  @IsEnum(enumData.NOTIF_TYPE)
  type: string;

  @ApiPropertyOptional({ description: 'Tiêu đề email' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  subject?: string;

  @ApiProperty({ description: 'Nội dung thông báo' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Thời gian lên lịch gửi' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  scheduledAt: Date;
}
