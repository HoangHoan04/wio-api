import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ description: 'Họ và tên' })
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

  @ApiPropertyOptional({ description: 'Tiêu đề' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({ description: 'Nội dung tin nhắn liên hệ' })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class FilterContactDto {
  @ApiPropertyOptional({ description: 'Mã liên hệ' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ description: 'Họ tên' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Trạng thái (PENDING | IN_PROGRESS | RESOLVED | CLOSED)' })
  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateContactStatusDto {
  @ApiProperty({ description: 'Mã ID liên hệ' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Trạng thái mới' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({ description: 'Ghi chú / Phản hồi từ Admin' })
  @IsString()
  @IsOptional()
  adminNote?: string;
}
