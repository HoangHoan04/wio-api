export * from './public.dto';

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateGuestDto {
  @ApiProperty({ description: 'ID Đám cưới' })
  @IsNotEmpty()
  @IsString()
  weddingId: string;

  @ApiProperty({
    description: 'ID Bàn tiệc (Null nếu chưa xếp)',
    required: false,
  })
  @IsOptional()
  @IsString()
  tableId?: string;

  @ApiProperty({ description: 'Họ và tên khách mời' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Danh xưng (Anh, Chị, Bác...)', required: false })
  @IsOptional()
  @IsString()
  salutation?: string;

  @ApiProperty({ description: 'Khách của ai', required: false })
  @IsOptional()
  @IsString()
  side?: string;

  @ApiProperty({ description: 'Khách VIP?', required: false })
  @IsOptional()
  @IsBoolean()
  isVip?: boolean;

  @ApiProperty({ description: 'Mã mờicá nhân hóa (Unique)', required: false })
  @IsOptional()
  @IsString()
  invitationCode?: string;

  @ApiProperty({ description: 'URL ảnh QR Code cá nhân', required: false })
  @IsOptional()
  @IsString()
  qrCodeUrl?: string;

  @ApiProperty({ description: 'Trạng thái RSVP', required: false })
  @IsOptional()
  @IsString()
  rsvpStatus?: string;

  @ApiProperty({ description: 'Số ngườđi kèm (+1, +2...)', required: false })
  @IsOptional()
  @IsNumber()
  attendingCount?: number;

  @ApiProperty({ description: 'Cần phương tiện di chuyển?', required: false })
  @IsOptional()
  @IsBoolean()
  needsTransport?: boolean;

  @ApiProperty({ description: 'Lời nhắn khi RSVP', required: false })
  @IsOptional()
  @IsString()
  rsvpNote?: string;

  @ApiProperty({ description: 'Thời gian RSVP', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  rsvpAt?: Date;

  @ApiProperty({
    description: 'Thời điểm link thiệp được gửi đi',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  invitedAt?: Date;

  @ApiProperty({ description: 'Lần đầu khách mở thiệp', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  invitationViewedAt?: Date;
}

export class UpdateGuestDto extends PartialType(CreateGuestDto) {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterGuestDto {
  @ApiProperty({ description: 'ID Đám cưới', required: false })
  @IsOptional()
  @IsString()
  weddingId?: string;

  @ApiProperty({
    description: 'ID Bàn tiệc (Null nếu chưa xếp)',
    required: false,
  })
  @IsOptional()
  @IsString()
  tableId?: string;

  @ApiProperty({ description: 'Họ và tên khách mời', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ description: 'Danh xưng (Anh, Chị, Bác...)', required: false })
  @IsOptional()
  @IsString()
  salutation?: string;

  @ApiProperty({
    description: 'Khách của ai',
    required: false,
  })
  @IsOptional()
  side?: string;

  @ApiProperty({ description: 'Khách VIP?', required: false })
  @IsOptional()
  @IsBoolean()
  isVip?: boolean;

  @ApiProperty({ description: 'Mã mời cá nhân hóa (Unique)', required: false })
  @IsOptional()
  @IsString()
  invitationCode?: string;

  @ApiProperty({ description: 'URL ảnh QR Code cá nhân', required: false })
  @IsOptional()
  @IsString()
  qrCodeUrl?: string;

  @ApiProperty({
    description: 'Trạng thái RSVP',
    required: false,
  })
  @IsOptional()
  rsvpStatus?: string;

  @ApiProperty({ description: 'Số người đi kèm (+1, +2...)', required: false })
  @IsOptional()
  @IsNumber()
  attendingCount?: number;

  @ApiProperty({ description: 'Cần phương tiện di chuyển?', required: false })
  @IsOptional()
  @IsBoolean()
  needsTransport?: boolean;

  @ApiProperty({ description: 'Lời nhắn khi RSVP', required: false })
  @IsOptional()
  @IsString()
  rsvpNote?: string;

  @ApiProperty({ description: 'Thời gian RSVP', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  rsvpAt?: Date;

  @ApiProperty({
    description: 'Thời điểm link thiệp được gửi đi',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  invitedAt?: Date;

  @ApiProperty({ description: 'Lần đầu khách mở thiệp', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  invitationViewedAt?: Date;
}
