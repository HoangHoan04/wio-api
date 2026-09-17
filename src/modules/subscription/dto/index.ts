import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

/* ============================================================
 * CREATE
 * ============================================================ */
export class CreateSubscriptionDto {
  @ApiProperty({ description: 'ID user đăng ký' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'ID gói dịch vụ' })
  @IsUUID()
  @IsNotEmpty()
  planId: string;

  @ApiPropertyOptional({
    description: 'Trạng thái gói',
    enum: enumData.SUB_STATUS,
    default: enumData.SUB_STATUS.ACTIVE.code,
  })
  @IsOptional()
  @IsEnum(enumData.SUB_STATUS)
  status?: string;

  @ApiPropertyOptional({ description: 'Ngày bắt đầu (mặc định = now)' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startedAt?: Date;

  @ApiPropertyOptional({
    description: 'Ngày hết hạn (mặc định = startedAt + durationDays của plan)',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date;
}

/* ============================================================
 * UPDATE
 * ============================================================ */
export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
  @ApiProperty({ description: 'ID subscription' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

/* ============================================================
 * FILTER
 * ============================================================ */
export class FilterSubscriptionDto {
  @ApiPropertyOptional({ description: 'ID user' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'ID gói dịch vụ' })
  @IsOptional()
  @IsUUID()
  planId?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái gói',
    enum: enumData.SUB_STATUS,
  })
  @IsOptional()
  @IsEnum(enumData.SUB_STATUS)
  status?: string;

  @ApiPropertyOptional({ description: 'Còn hiệu lực (expiresAt > now)' })
  @IsOptional()
  isActive?: boolean;
}

/* ============================================================
 * ADMIN — Change plan
 * ============================================================ */
export class AdminChangeSubscriptionPlanDto {
  @ApiProperty({ description: 'ID subscription' })
  @IsUUID()
  @IsNotEmpty()
  subscriptionId: string;

  @ApiProperty({ description: 'ID gói dịch vụ mới' })
  @IsUUID()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ description: 'Ngày hết hạn mới' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  expiresAt: Date;
}
