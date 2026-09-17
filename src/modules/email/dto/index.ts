import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/* ============================================================
 * SEND VERIFY / FORGOT PASSWORD OTP
 * ============================================================ */
export class SendOtpEmailDto {
  @ApiProperty({ description: 'Email nhận OTP' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Mã OTP' })
  @IsString()
  @IsNotEmpty()
  otpCode: string;
}

/* ============================================================
 * SEND CONTACT
 * ============================================================ */
export class SendContactDto {
  @ApiProperty({ description: 'Họ và tên người liên hệ' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Email người liên hệ' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'Chủ đề liên hệ' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({ description: 'Nội dung tin nhắn' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}

/* ============================================================
 * TYPE (dùng cho service, không validate)
 * ============================================================ */
export interface ContactEmailData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}
