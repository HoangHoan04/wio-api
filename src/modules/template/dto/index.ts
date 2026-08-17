import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
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

  @ApiProperty({ description: 'Mô tả ngắn', required: false })
  @IsOptional()
  @IsString()
  description?: string;

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
  features?: any;

  @ApiProperty({ description: 'Đường dẫn ảnh thu nhỏ', required: false })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({ description: 'Mã giao diện (Frontend Component Mapping)' })
  @IsNotEmpty()
  @IsString()
  themeCode: string;

  @ApiProperty({ description: 'Giao diện trả phí?', default: false })
  @IsBoolean()
  isPremium: boolean;

  @ApiProperty({
    description: 'ID gói tối thiểu để sử dụng',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsUUID()
  minPlanId?: string;

  @ApiProperty({ description: 'Số ngày dùng thử', default: 3 })
  @IsNotEmpty()
  @IsNumber()
  trialDays: number;

  @ApiProperty({ description: 'Loại thiệp áp dụng', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cardTypes?: string[];

  @ApiProperty({ description: 'Bố cục section mặc định', required: false })
  @IsOptional()
  themeLayout?: Record<string, any>;

  @ApiProperty({ description: 'Design tokens preset', required: false })
  @IsOptional()
  presetTokens?: Record<string, any>;
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

export class SetIsShowTemplateDto {
  @ApiProperty({ description: 'ID mẫu giao diện' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Trạng thái hiển thị' })
  @IsNotEmpty()
  @IsBoolean()
  isShow: boolean;
}

export class SetIsDeletedTemplateDto {
  @ApiProperty({ description: 'ID mẫu giao diện' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Trạng thái xóa mềm' })
  @IsNotEmpty()
  @IsBoolean()
  isDeleted: boolean;
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

  @ApiProperty({ description: 'Trạng thái xóa mềm', required: false })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @ApiProperty({
    description: 'ID gói tối thiểu để sử dụng',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? undefined : value))
  @IsUUID()
  minPlanId?: string;

  @ApiProperty({ description: 'Loại thiệp', required: false })
  @IsOptional()
  @IsString()
  cardType?: string;
}
