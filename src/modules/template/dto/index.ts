import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnumCode } from '@/common/decorators';
import { normalizeTemplateFeatures } from '../template.utils';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/* ============================================================
 * CREATE
 * ============================================================ */
export class CreateTemplateDto {
  @ApiProperty({ description: 'Tên mẫu giao diện' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Slug định danh template' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;

  @ApiPropertyOptional({ description: 'Mô tả ngắn' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    description: 'Phong cách cưới',
    enum: enumData.WEDDING_THEME,
  })
  @IsNotEmpty()
  @IsEnumCode(enumData.WEDDING_THEME)
  weddingTheme: string;

  @ApiPropertyOptional({ description: 'Từ khoá tìm kiếm', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Tông màu chủ đạo' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  colorMood?: string;

  @ApiPropertyOptional({ description: 'Cấu hình tính năng / danh sách nổi bật' })
  @IsOptional()
  @Transform(({ value }) => normalizeTemplateFeatures(value))
  @IsObject()
  features?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Bố cục section mặc định' })
  @IsOptional()
  @IsObject()
  themeLayout?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Design tokens preset' })
  @IsOptional()
  @IsObject()
  presetTokens?: Record<string, any>;

  @ApiPropertyOptional({ description: 'URL ảnh thumbnail' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ description: 'URL xem trước' })
  @IsOptional()
  @IsString()
  previewUrl?: string;

  @ApiProperty({ description: 'Mã giao diện (theme)' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  themeCode: string;

  @ApiPropertyOptional({
    description: 'Loại template',
    enum: enumData.TEMPLATE_KIND,
  })
  @IsOptional()
  @IsEnumCode(enumData.TEMPLATE_KIND)
  kind?: string;

  @ApiPropertyOptional({ description: 'Preset Canva' })
  @IsOptional()
  @IsObject()
  canvasPreset?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Version template' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  version?: number;

  @ApiPropertyOptional({ description: 'Hiển thị template?', default: true })
  @IsOptional()
  @IsBoolean()
  isShow?: boolean;

  @ApiPropertyOptional({ description: 'Template trả phí?', default: false })
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @ApiPropertyOptional({ description: 'ID gói tối thiểu' })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null ? undefined : value,
  )
  @IsUUID()
  minPlanId?: string;

  @ApiPropertyOptional({ description: 'Số ngày dùng thử', default: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(30)
  trialDays?: number;

  @ApiPropertyOptional({ description: 'Thứ tự hiển thị', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Phong cách cưới áp dụng cho template',
    type: [String],
    enum: enumData.WEDDING_THEME,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnumCode(enumData.WEDDING_THEME, { each: true })
  categories?: string[];
}

/* ============================================================
 * UPDATE
 * ============================================================ */
export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  @ApiProperty({ description: 'ID template' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

/* ============================================================
 * SET STATUS
 * ============================================================ */
export class SetPremiumTemplateDto {
  @ApiProperty({ description: 'ID template' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Template trả phí?' })
  @IsNotEmpty()
  @IsBoolean()
  isPremium: boolean;
}

export class SetIsShowTemplateDto {
  @ApiProperty({ description: 'ID template' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Hiển thị?' })
  @IsNotEmpty()
  @IsBoolean()
  isShow: boolean;
}

export class SetIsDeletedTemplateDto {
  @ApiProperty({ description: 'ID template' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Xoá mềm?' })
  @IsNotEmpty()
  @IsBoolean()
  isDeleted: boolean;
}

/* ============================================================
 * FILTER
 * ============================================================ */
export class FilterTemplateDto {
  @ApiPropertyOptional({ description: 'ID template' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({ description: 'Tên template' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Mã giao diện' })
  @IsOptional()
  @IsString()
  themeCode?: string;

  @ApiPropertyOptional({ description: 'Slug template' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Loại template',
    enum: enumData.TEMPLATE_KIND,
  })
  @IsOptional()
  @IsEnumCode(enumData.TEMPLATE_KIND)
  kind?: string;

  @ApiPropertyOptional({
    description: 'Phong cách cưới',
    enum: enumData.WEDDING_THEME,
  })
  @IsOptional()
  @IsEnumCode(enumData.WEDDING_THEME)
  weddingTheme?: string;

  @ApiPropertyOptional({ description: 'Đang hiển thị?' })
  @IsOptional()
  @IsBoolean()
  isShow?: boolean;

  @ApiPropertyOptional({ description: 'Trả phí?' })
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @ApiPropertyOptional({ description: 'Xoá mềm?' })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @ApiPropertyOptional({ description: 'ID gói tối thiểu' })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null ? undefined : value,
  )
  @IsUUID()
  minPlanId?: string;
}
