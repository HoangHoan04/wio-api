import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

/* ============================================================
 * CREATE
 * ============================================================ */
export class CreateServicePlanDto {
  @ApiProperty({ description: 'Tên gói dịch vụ' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Mã gói dịch vụ',
    enum: enumData.SERVICE_PLAN_CODE,
  })
  @IsNotEmpty()
  @IsEnum(enumData.SERVICE_PLAN_CODE)
  code: string;

  @ApiProperty({ description: 'Số thiệp tối đa' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxInvitations: number;

  @ApiProperty({ description: 'Số khách mời tối đa' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxGuests: number;

  @ApiProperty({ description: 'Số ảnh tối đa' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPhotos: number;

  @ApiProperty({ description: 'Có tính năng AI?' })
  @IsNotEmpty()
  @IsBoolean()
  hasAi: boolean;

  @ApiProperty({ description: 'Có tính năng phân tích?' })
  @IsNotEmpty()
  @IsBoolean()
  hasAnalytics: boolean;

  @ApiProperty({ description: 'Có cho phép custom slug?' })
  @IsNotEmpty()
  @IsBoolean()
  hasCustomSlug: boolean;

  @ApiProperty({ description: 'Có cho phép tự thiết kế (Canva)?' })
  @IsNotEmpty()
  @IsBoolean()
  hasCustomDesign: boolean;

  @ApiProperty({ description: 'Số ngày hiệu lực' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationDays: number;

  @ApiProperty({ description: 'Giá gói (VND)' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priceVnd: number;

  @ApiPropertyOptional({ description: 'Trạng thái hoạt động', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Thứ tự hiển thị', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

/* ============================================================
 * UPDATE
 * ============================================================ */
export class UpdateServicePlanDto extends PartialType(CreateServicePlanDto) {
  @ApiProperty({ description: 'ID gói dịch vụ' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

/* ============================================================
 * FILTER
 * ============================================================ */
export class FilterServicePlanDto {
  @ApiPropertyOptional({ description: 'Tên gói' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Mã gói',
    enum: enumData.SERVICE_PLAN_CODE,
  })
  @IsOptional()
  @IsEnum(enumData.SERVICE_PLAN_CODE)
  code?: string;

  @ApiPropertyOptional({ description: 'Có tính năng AI?' })
  @IsOptional()
  @IsBoolean()
  hasAi?: boolean;

  @ApiPropertyOptional({ description: 'Có phân tích?' })
  @IsOptional()
  @IsBoolean()
  hasAnalytics?: boolean;

  @ApiPropertyOptional({ description: 'Có custom slug?' })
  @IsOptional()
  @IsBoolean()
  hasCustomSlug?: boolean;

  @ApiPropertyOptional({ description: 'Có custom design?' })
  @IsOptional()
  @IsBoolean()
  hasCustomDesign?: boolean;

  @ApiPropertyOptional({ description: 'Đang hoạt động?' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Giá tối thiểu' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priceVndMin?: number;

  @ApiPropertyOptional({ description: 'Giá tối đa' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priceVndMax?: number;
}
