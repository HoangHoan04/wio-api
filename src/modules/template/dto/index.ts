import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({ description: 'Tên mẫu giao diện' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Mô tả ngắn' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Tags phong cách',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'Cấu hình tính năng dạng JSON', required: false })
  @IsOptional()
  @IsObject()
  features?: any;

  @ApiProperty({ description: 'Đường dẫn ảnh thu nhỏ', required: false })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({ description: 'Mã giao diện (Frontend Component Mapping)' })
  @IsNotEmpty()
  @IsString()
  themeCode: string;

  @ApiProperty({ description: 'Trạng thái hiển thị', default: true })
  @IsNotEmpty()
  @IsBoolean()
  isShow: boolean;

  @ApiProperty({ description: 'Giao diện trả phí?', default: false })
  @IsNotEmpty()
  @IsBoolean()
  isPremium: boolean;

  @ApiProperty({
    description: 'Gói tối thiểu để sử dụng',
    default: 'free',
  })
  @IsNotEmpty()
  @IsString()
  minPlan: string;

  @ApiProperty({ description: 'Số ngày dùng thử', default: 3 })
  @IsNotEmpty()
  @IsNumber()
  trialDays: number;
}

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  @ApiProperty({ description: 'ID mẫu giao diện' })
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

  @ApiProperty({ description: 'Mã giao diện', required: false })
  @IsOptional()
  @IsString()
  themeCode?: string;

  @ApiProperty({ description: 'Trạng thái hiển thị', required: false })
  @IsOptional()
  @IsBoolean()
  isShow?: boolean;

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
}
