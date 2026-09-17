import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/* ============================================================
 * TRANSFORM — Chuyển string CSV → mảng
 * ============================================================ */
const toArrayTransform = ({ value }: { value: any }) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return undefined;
};

/* ============================================================
 * CREATE
 * ============================================================ */
export class CreateStockAssetDto {
  @ApiProperty({ description: 'Tên hiển thị của asset' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    description: 'Danh mục asset',
    enum: enumData.STOCK_ASSET_CATEGORY,
  })
  @IsNotEmpty()
  @IsEnum(enumData.STOCK_ASSET_CATEGORY)
  category: string;

  @ApiPropertyOptional({
    description: 'Loại asset',
    enum: enumData.STOCK_ASSET_KIND,
  })
  @IsNotEmpty()
  @IsEnum(enumData.STOCK_ASSET_KIND)
  kind: string;

  @ApiPropertyOptional({
    description: 'Từ khóa tìm kiếm',
    type: [String],
  })
  @IsOptional()
  @Transform(toArrayTransform)
  tags?: string[];

  @ApiProperty({ description: 'URL file asset (PNG/WebP/JPEG)' })
  @IsNotEmpty()
  @IsString()
  src: string;

  @ApiPropertyOptional({ description: 'URL thumbnail (mặc định = src)' })
  @IsOptional()
  @IsString()
  thumb?: string;

  @ApiPropertyOptional({ description: 'Bản quyền / nguồn' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  license?: string;

  @ApiPropertyOptional({ description: 'Thứ tự hiển thị', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Đang hiển thị trên editor',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/* ============================================================
 * UPDATE
 * ============================================================ */
export class UpdateStockAssetDto extends PartialType(CreateStockAssetDto) {
  @ApiProperty({ description: 'ID asset' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

/* ============================================================
 * FILTER
 * ============================================================ */
export class FilterStockAssetDto {
  @ApiPropertyOptional({ description: 'Tên asset' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Danh mục',
    enum: enumData.STOCK_ASSET_CATEGORY,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(enumData.STOCK_ASSET_CATEGORY)
  category?: string;

  @ApiPropertyOptional({
    description: 'Loại',
    enum: enumData.STOCK_ASSET_KIND,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(enumData.STOCK_ASSET_KIND)
  kind?: string;

  @ApiPropertyOptional({ description: 'Đang hiển thị?' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/* ============================================================
 * PUBLIC — Danh sách cho editor
 * ============================================================ */
export class PublicStockAssetListDto {
  @ApiPropertyOptional({ description: 'Từ khoá tìm kiếm' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({
    description: 'Danh mục',
    enum: enumData.STOCK_ASSET_CATEGORY,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === 'all' ? undefined : value,
  )
  @IsEnum(enumData.STOCK_ASSET_CATEGORY)
  category?: string;

  @ApiPropertyOptional({
    description: 'Loại',
    enum: enumData.STOCK_ASSET_KIND,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(enumData.STOCK_ASSET_KIND)
  kind?: string;

  @ApiPropertyOptional({ description: 'Bỏ qua', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({ description: 'Số lượng', default: 24 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(48)
  take?: number;
}
