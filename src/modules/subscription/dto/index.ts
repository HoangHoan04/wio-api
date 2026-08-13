import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'ID User đăng ký' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'ID Gói dịch vụ' })
  @IsNotEmpty()
  @IsString()
  planId: string;

  @ApiProperty({ description: 'Trạng thái gói', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Ngày bắt đầu' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startedAt: Date;

  @ApiProperty({ description: 'Ngày hết hạn' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  expiresAt: Date;
}

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterSubscriptionDto {
  @ApiProperty({ description: 'ID User đăng ký', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'ID Gói dịch vụ', required: false })
  @IsOptional()
  @IsString()
  planId?: string;

  @ApiProperty({ description: 'Trạng thái gói', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Ngày bắt đầu', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startedAt?: Date;

  @ApiProperty({ description: 'Ngày hết hạn', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date;
}

export class AdminChangeSubscriptionPlanDto {
  @ApiProperty({ description: 'ID Đăng ký' })
  @IsUUID()
  @IsNotEmpty()
  subscriptionId: string;

  @ApiProperty({ description: 'ID Gói dịch vụ mới' })
  @IsUUID()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ description: 'Ngày hết hạn mới' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  expiresAt: Date;
}
