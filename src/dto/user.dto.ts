import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserDto {
  @ApiProperty({ description: 'Id người dùng' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'Email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Họ và tên' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Google ID' })
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiProperty({ description: 'Facebook ID' })
  @IsOptional()
  @IsString()
  facebookId?: string;

  @ApiProperty({ description: 'Đã xác thực email?' })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ description: 'Là admin?' })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @ApiProperty({ description: 'Lần đăng nhập cuối' })
  @IsOptional()
  @IsDate()
  lastLoginAt?: Date;

  @ApiProperty({ description: 'Tài khoản có đang hoạt động không' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
