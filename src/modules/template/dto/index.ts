import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({ description: 'Tên mẫu giao diện' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Đường dẫn ảnh thu nhỏ', required: false })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'Cấu hình màu sắc, font, layout dạng JSON',
    required: false,
  })
  @IsOptional()
  cssConfig?: any;

  @ApiProperty({ description: 'Đường dẫn xem trước mẫu', required: false })
  @IsOptional()
  @IsString()
  previewUrl?: string;

  @ApiProperty({ description: 'Trạng thái hoạt động' })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ description: 'Giao diện trả phí?' })
  @IsNotEmpty()
  @IsBoolean()
  isPremium: boolean;

  @ApiProperty({
    description: 'Gói tối thiểu để sử dụng (free | basic | premium)',
    required: false,
  })
  @IsOptional()
  @IsString()
  minPlan?: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp' })
  @IsNotEmpty()
  @IsNumber()
  sortOrder: number;
}

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class SetPremiumTemplateDto {
  @ApiProperty({ description: 'ID mẫu giao diện' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Giao diện trả phí?' })
  @IsNotEmpty()
  @IsBoolean()
  isPremium: boolean;
}

export class FilterTemplateDto {
  @ApiProperty({ description: 'Tên mẫu giao diện', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Đường dẫn ảnh thu nhỏ', required: false })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'Cấu hình màu sắc, font, layout dạng JSON',
    required: false,
  })
  @IsOptional()
  cssConfig?: any;

  @ApiProperty({ description: 'Đường dẫn xem trước mẫu', required: false })
  @IsOptional()
  @IsString()
  previewUrl?: string;

  @ApiProperty({ description: 'Trạng thái hoạt động', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Giao diện trả phí?', required: false })
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @ApiProperty({
    description: 'Gói tối thiểu để sử dụng (free | basic | premium)',
    required: false,
  })
  @IsOptional()
  @IsString()
  minPlan?: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp', required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
