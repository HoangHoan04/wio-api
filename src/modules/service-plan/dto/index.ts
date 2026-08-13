import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServicePlanDto {
  @ApiProperty({ description: 'Tên gói (Free, Basic, Premium...)' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Số lượng khách tối đa' })
  @IsNotEmpty()
  @IsNumber()
  maxGuests: number;

  @ApiProperty({ description: 'Số lượng ảnh tối đa' })
  @IsNotEmpty()
  @IsNumber()
  maxPhotos: number;

  @ApiProperty({ description: 'Số lượng template tối đa' })
  @IsNotEmpty()
  @IsNumber()
  maxInvitations: number;

  @ApiProperty({ description: 'Có tính năng AI?' })
  @IsNotEmpty()
  @IsBoolean()
  hasAi: boolean;

  @ApiProperty({ description: 'Có tính năng thống kê?' })
  @IsNotEmpty()
  @IsBoolean()
  hasAnalytics: boolean;

  @ApiProperty({ description: 'Có slug tùy chỉnh?' })
  @IsNotEmpty()
  @IsBoolean()
  hasCustomSlug: boolean;

  @ApiProperty({ description: 'Thời hạn (ngày)' })
  @IsNotEmpty()
  @IsNumber()
  durationDays: number;

  @ApiProperty({ description: 'Giá (VND)' })
  @IsNotEmpty()
  @IsNumber()
  priceVnd: number;

  @ApiProperty({ description: 'Trạng thái hoạt động' })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}

export class UpdateServicePlanDto extends PartialType(CreateServicePlanDto) {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterServicePlanDto {
  @ApiProperty({
    description: 'Tên gói (Free, Basic, Premium...)',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Số lượng khách tối đa', required: false })
  @IsOptional()
  @IsNumber()
  maxGuests?: number;

  @ApiProperty({ description: 'Số lượng ảnh tối đa', required: false })
  @IsOptional()
  @IsNumber()
  maxPhotos?: number;

  @ApiProperty({ description: 'Số lượng template tối đa', required: false })
  @IsOptional()
  @IsNumber()
  maxInvitations?: number;

  @ApiProperty({ description: 'Có tính năng AI?', required: false })
  @IsOptional()
  @IsBoolean()
  hasAi?: boolean;

  @ApiProperty({ description: 'Có tính năng thống kê?', required: false })
  @IsOptional()
  @IsBoolean()
  hasAnalytics?: boolean;

  @ApiProperty({ description: 'Có slug tùy chỉnh?', required: false })
  @IsOptional()
  @IsBoolean()
  hasCustomSlug?: boolean;

  @ApiProperty({ description: 'Thời hạn (ngày)', required: false })
  @IsOptional()
  @IsNumber()
  durationDays?: number;

  @ApiProperty({ description: 'Giá (VND)', required: false })
  @IsOptional()
  @IsNumber()
  priceVnd?: number;

  @ApiProperty({ description: 'Trạng thái hoạt động', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
