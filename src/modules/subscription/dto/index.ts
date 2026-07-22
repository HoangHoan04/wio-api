import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'ID User đăng ký' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'ID Đám cưới sử dụng gói', required: false })
  @IsOptional()
  @IsString()
  weddingId?: string;

  @ApiProperty({ description: 'ID Gói dịch vụ' })
  @IsNotEmpty()
  @IsString()
  planId: string;

  @ApiProperty({ description: 'Trạng thái gói' })
  @IsNotEmpty()
  @IsString()
  status: string;

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

  @ApiProperty({ description: 'Số tiền đã thanh toán', required: false })
  @IsOptional()
  @IsNumber()
  paidAmountVnd?: number;

  @ApiProperty({ description: 'Phương thức thanh toán', required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({ description: 'Mã giao dịch', required: false })
  @IsOptional()
  @IsString()
  paymentRef?: string;
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

  @ApiProperty({ description: 'ID Đám cưới sử dụng gói', required: false })
  @IsOptional()
  @IsString()
  weddingId?: string;

  @ApiProperty({ description: 'ID Gói dịch vụ', required: false })
  @IsOptional()
  @IsString()
  planId?: string;

  @ApiProperty({
    description: 'Trạng thái gói',
    required: false,
  })
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

  @ApiProperty({ description: 'Số tiền đã thanh toán', required: false })
  @IsOptional()
  @IsNumber()
  paidAmountVnd?: number;

  @ApiProperty({ description: 'Phương thức thanh toán', required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({ description: 'Mã giao dịch', required: false })
  @IsOptional()
  @IsString()
  paymentRef?: string;
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

  @ApiProperty({ description: 'Số tiền thanh toán mới', required: false })
  @IsOptional()
  @IsNumber()
  paidAmountVnd?: number;

  @ApiProperty({ description: 'Phương thức thanh toán mới', required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({ description: 'Mã giao dịch mới', required: false })
  @IsOptional()
  @IsString()
  paymentRef?: string;
}
