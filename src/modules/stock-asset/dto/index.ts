import { enumData } from '@/common/constanst/enumData';
import { IsEnumCode } from '@/common/decorators';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateStockAssetDto {
  @ApiProperty({ description: 'Tên hiển thị' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  title: string;

  @ApiProperty({ enum: enumData.STOCK_ASSET_CATEGORY })
  @IsNotEmpty()
  @IsEnumCode(enumData.STOCK_ASSET_CATEGORY)
  category: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return undefined;
  })
  tags?: string[];

  @ApiProperty({ description: 'URL PNG/WebP/JPEG' })
  @IsNotEmpty()
  @IsString()
  src: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  thumb?: string;

  @ApiProperty({ enum: enumData.STOCK_ASSET_KIND })
  @IsNotEmpty()
  @IsEnumCode(enumData.STOCK_ASSET_KIND)
  kind: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  license?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateStockAssetDto extends PartialType(CreateStockAssetDto) {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterStockAssetDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false, enum: enumData.STOCK_ASSET_CATEGORY })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnumCode(enumData.STOCK_ASSET_CATEGORY)
  category?: string;

  @ApiProperty({ required: false, enum: enumData.STOCK_ASSET_KIND })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnumCode(enumData.STOCK_ASSET_KIND)
  kind?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class PublicStockAssetListDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ required: false, enum: enumData.STOCK_ASSET_CATEGORY })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false, enum: enumData.STOCK_ASSET_KIND })
  @IsOptional()
  @IsString()
  kind?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiProperty({ required: false, default: 24 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(48)
  take?: number;
}
