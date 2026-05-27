import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateWishDto {
  @ApiProperty({ description: 'ID Đám cưới' })
  @IsNotEmpty()
  @IsString()
  weddingId: string;

  @ApiProperty({
    description: 'ID Khách mời (Null nếu không có mã)',
    required: false,
  })
  @IsOptional()
  @IsString()
  guestId?: string;

  @ApiProperty({ description: 'Tên người gửi (Fallback nếu guestId null)' })
  @IsNotEmpty()
  @IsString()
  guestName: string;

  @ApiProperty({ description: 'Nội dung lời chúc' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Đã duyệt?' })
  @IsNotEmpty()
  @IsBoolean()
  isApproved: boolean;

  @ApiProperty({ description: 'Ghim lên đầu?' })
  @IsNotEmpty()
  @IsBoolean()
  isPinned: boolean;

  @ApiProperty({ description: 'Thời gian duyệt', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  approvedAt?: Date;
}

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterWishDto {
  @ApiProperty({ description: 'ID Đám cưới', required: false })
  @IsOptional()
  @IsString()
  weddingId?: string;

  @ApiProperty({
    description: 'ID Khách mời (Null nếu không có mã)',
    required: false,
  })
  @IsOptional()
  @IsString()
  guestId?: string;

  @ApiProperty({
    description: 'Tên người gửi (Fallback nếu guestId null)',
    required: false,
  })
  @IsOptional()
  @IsString()
  guestName?: string;

  @ApiProperty({ description: 'Nội dung lời chúc', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: 'Đã duyệt?', required: false })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @ApiProperty({ description: 'Ghim lên đầu?', required: false })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiProperty({ description: 'Thời gian duyệt', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  approvedAt?: Date;
}
