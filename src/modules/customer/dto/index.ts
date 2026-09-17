import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

/* ============================================================
 * FILTER
 * ============================================================ */
export class FilterCustomerDto {
  @ApiPropertyOptional({ description: 'Mã khách hàng' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: 'Họ và tên khách hàng' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Đã xoá mềm?' })
  @IsOptional()
  isDeleted?: boolean;
}

/* ============================================================
 * CHANGE PASSWORD
 * ============================================================ */
export class ChangeCustomerPasswordDto {
  @ApiProperty({ description: 'ID khách hàng' })
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'Mật khẩu mới' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 50, { message: 'Mật khẩu phải từ 6 đến 50 ký tự' })
  newPassword: string;
}
