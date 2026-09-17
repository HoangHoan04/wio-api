import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

/* ============================================================
 * CREATE
 * ============================================================ */
export class CreateContactDto {
  @ApiProperty({ description: 'Họ và tên người liên hệ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email liên hệ' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Tiêu đề liên hệ' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({ description: 'Nội dung tin nhắn liên hệ' })
  @IsString()
  @IsNotEmpty()
  message: string;
}

/* ============================================================
 * FILTER
 * ============================================================ */
export class FilterContactDto {
  @ApiPropertyOptional({ description: 'Mã liên hệ' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: 'Họ tên người liên hệ' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Email liên hệ' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái xử lý',
    enum: enumData.CONTACT_STATUS,
  })
  @IsOptional()
  @IsEnum(enumData.CONTACT_STATUS)
  status?: string;
}

/* ============================================================
 * UPDATE STATUS
 * ============================================================ */
export class UpdateContactStatusDto {
  @ApiProperty({ description: 'ID liên hệ' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Trạng thái mới',
    enum: enumData.CONTACT_STATUS,
  })
  @IsEnum(enumData.CONTACT_STATUS)
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({ description: 'Ghi chú / phản hồi từ admin' })
  @IsString()
  @IsOptional()
  adminNote?: string;
}
