import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID Đám cưới' })
  @IsNotEmpty()
  @IsString()
  weddingId: string;

  @ApiProperty({
    description: 'ID Khách mời (Null = gửi broadcast)',
    required: false,
  })
  @IsOptional()
  @IsString()
  guestId?: string;

  @ApiProperty({ description: 'Kênh gửi' })
  @IsNotEmpty()
  channel: string;

  @ApiProperty({ description: 'Loại thông báo' })
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Chủ đề email', required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ description: 'Nội dung thông báo' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Trạng thái gửi' })
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: 'Thời gian lên lịch gửi' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  scheduledAt: Date;

  @ApiProperty({ description: 'Thời gian đã gửi', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  sentAt?: Date;

  @ApiProperty({ description: 'Lý do thất bại', required: false })
  @IsOptional()
  @IsString()
  failedReason?: string;

  @ApiProperty({
    description: 'Nhà cung cấp (Zalo ZNS, Twilio...)',
    required: false,
  })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiProperty({
    description: 'Message ID trả về từ provider',
    required: false,
  })
  @IsOptional()
  @IsString()
  providerMsgId?: string;
}

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterNotificationDto {
  @ApiProperty({ description: 'ID Đám cưới', required: false })
  @IsOptional()
  @IsString()
  weddingId?: string;

  @ApiProperty({
    description: 'ID Khách mời (Null = gửi broadcast)',
    required: false,
  })
  @IsOptional()
  @IsString()
  guestId?: string;

  @ApiProperty({ description: 'Kênh gửi', required: false })
  @IsOptional()
  @IsString()
  channel?: string;

  @ApiProperty({
    description: 'Loại thông báo',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ description: 'Chủ đề email', required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ description: 'Nội dung thông báo', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Trạng thái gửi',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Thời gian lên lịch gửi', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledAt?: Date;

  @ApiProperty({ description: 'Thời gian đã gửi', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  sentAt?: Date;

  @ApiProperty({ description: 'Lý do thất bại', required: false })
  @IsOptional()
  @IsString()
  failedReason?: string;

  @ApiProperty({
    description: 'Nhà cung cấp (Zalo ZNS, Twilio...)',
    required: false,
  })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiProperty({
    description: 'Message ID trả về từ provider',
    required: false,
  })
  @IsOptional()
  @IsString()
  providerMsgId?: string;
}
