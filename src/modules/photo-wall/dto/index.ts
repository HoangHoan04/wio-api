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

export class CreatePhotoWallDto {
  @ApiProperty({ description: 'ID Thiệp' })
  @IsNotEmpty()
  @IsString()
  invitationId: string;

  @ApiProperty({
    description: 'ID Khách mời (Null nếu upload ẩn danh)',
    required: false,
  })
  @IsOptional()
  @IsString()
  guestId?: string;

  @ApiProperty({ description: 'Tên người upload' })
  @IsNotEmpty()
  @IsString()
  uploaderName: string;

  @ApiProperty({ description: 'Đường dẫn ảnh' })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({ description: 'Key lưu trữ', required: false })
  @IsOptional()
  @IsString()
  storageKey?: string;

  @ApiProperty({ description: 'Chú thích ảnh', required: false })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({ description: 'Đã duyệt?', required: false })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @ApiProperty({ description: 'Thời gian duyệt', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  approvedAt?: Date;
}

export class UpdatePhotoWallDto extends PartialType(CreatePhotoWallDto) {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterPhotoWallDto {
  @ApiProperty({ description: 'ID Thiệp', required: false })
  @IsOptional()
  @IsString()
  invitationId?: string;

  @ApiProperty({
    description: 'ID Khách mời (Null nếu upload ẩn danh)',
    required: false,
  })
  @IsOptional()
  @IsString()
  guestId?: string;

  @ApiProperty({ description: 'Tên người upload', required: false })
  @IsOptional()
  @IsString()
  uploaderName?: string;

  @ApiProperty({ description: 'Đường dẫn ảnh', required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ description: 'Key lưu trữ', required: false })
  @IsOptional()
  @IsString()
  storageKey?: string;

  @ApiProperty({ description: 'Chú thích ảnh', required: false })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({ description: 'Đã duyệt?', required: false })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @ApiProperty({ description: 'Thời gian duyệt', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  approvedAt?: Date;
}
