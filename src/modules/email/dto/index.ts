import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export interface ContactEmailData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export class SendContactDto {
  @ApiProperty({ description: 'Họ và tên người liên hệ' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Email người liên hệ' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Chủ đề liên hệ' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ description: 'Nội dung tin nhắn' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  message: string;
}
