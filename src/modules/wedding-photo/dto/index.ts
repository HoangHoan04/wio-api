import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateWeddingPhotoDto {
  @ApiProperty({ description: 'ID Đám cưới' })
  @IsNotEmpty()
  @IsString()
  weddingId: string;

  @ApiProperty({ description: 'Đường dẫn ảnh' })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({ description: 'Key trên S3/Cloudinary', required: false })
  @IsOptional()
  @IsString()
  storageKey?: string;

  @ApiProperty({ description: 'Chú thích ảnh', required: false })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp' })
  @IsNotEmpty()
  @IsNumber()
  sortOrder: number;
}

export class UpdateWeddingPhotoDto extends PartialType(CreateWeddingPhotoDto) {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterWeddingPhotoDto {
  @ApiProperty({ description: 'ID Đám cưới', required: false })
  @IsOptional()
  @IsString()
  weddingId?: string;

  @ApiProperty({ description: 'Đường dẫn ảnh', required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ description: 'Key trên S3/Cloudinary', required: false })
  @IsOptional()
  @IsString()
  storageKey?: string;

  @ApiProperty({ description: 'Chú thích ảnh', required: false })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp', required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
