import { NotifChannel, NotifStatus, NotifType } from '@/entities/enums';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
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

  @ApiProperty({ description: 'Kênh gửi', enum: NotifChannel })
  @IsNotEmpty()
  @IsEnum(NotifChannel)
  channel: NotifChannel;

  @ApiProperty({ description: 'Loại thông báo', enum: NotifType })
  @IsNotEmpty()
  @IsEnum(NotifType)
  type: NotifType;

  @ApiProperty({ description: 'Chủ đề email', required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ description: 'Nội dung thông báo' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Trạng thái gửi', enum: NotifStatus })
  @IsNotEmpty()
  @IsEnum(NotifStatus)
  status: NotifStatus;

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

  @ApiProperty({ description: 'Kênh gửi', enum: NotifChannel, required: false })
  @IsOptional()
  @IsEnum(NotifChannel)
  channel?: NotifChannel;

  @ApiProperty({
    description: 'Loại thông báo',
    enum: NotifType,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotifType)
  type?: NotifType;

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
    enum: NotifStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotifStatus)
  status?: NotifStatus;

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
