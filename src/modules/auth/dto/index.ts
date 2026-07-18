import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UserLoginDto {
  @ApiProperty({ description: 'Tài khoản đăng nhập (Email)' })
  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Mật khẩu người dùng' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString()
  @Length(6, 50, { message: 'Mật khẩu phải từ 6 đến 50 ký tự' })
  password: string;
}

export class GoogleLoginDto {
  @ApiProperty({ description: 'Id Token hoặc Access Token nhận từ Google' })
  @IsNotEmpty()
  @IsString()
  idToken: string;
}

export class FacebookLoginDto {
  @ApiProperty({ description: 'Access Token nhận từ Facebook API' })
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Chuỗi Refresh Token' })
  @IsString()
  refreshToken: string;
}

export class UpdatePasswordDto {
  @ApiProperty({ description: 'Mật khẩu hiện tại' })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'Mật khẩu mới' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 50, { message: 'Mật khẩu mới phải từ 6 đến 50 ký tự' })
  newPassword: string;
}

export class ChangePasswordDto extends UpdatePasswordDto {
  @ApiProperty({ description: 'Xác nhận lại mật khẩu mới' })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

export class CheckPhoneAndEmailDto {
  @ApiPropertyOptional({ description: 'Email cần kiểm tra' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại cần kiểm tra' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class SendOtpCustomerDto {
  @ApiPropertyOptional({ description: 'Email nhận OTP' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại nhận OTP' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Phương thức gửi' })
  @IsNotEmpty()
  sendMethod: string;
}

export class SendOtpVerifyDto {
  @ApiProperty({ description: 'Định danh (Email hoặc Số điện thoại)' })
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @ApiProperty({ description: 'Phương thức' })
  @IsNotEmpty()
  method: string;
}

export class RegisterDto {
  @ApiProperty({ description: 'Họ và tên học viên' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email đăng ký' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Số điện thoại đăng ký' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Mật khẩu tài khoản' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  password: string;

  @ApiProperty({ description: 'Mã OTP xác thực' })
  @IsNotEmpty()
  @IsString()
  otpCode: string;

  @ApiProperty({ description: 'Phương thức xác thực OTP: EMAIL | PHONE' })
  @IsNotEmpty()
  @IsEnum(['EMAIL', 'PHONE'])
  sendMethod: 'EMAIL' | 'PHONE';

  @ApiPropertyOptional({ description: 'Giới tính' })
  @IsOptional()
  @IsString()
  gender?: string;
}

export class ForgotPasswordCustomerDto {
  @ApiProperty({ description: 'Định danh tài khoản (Email/Phone)' })
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @ApiProperty({ description: 'Mã OTP xác thực' })
  @IsNotEmpty()
  @IsString()
  otpCode: string;

  @ApiProperty({ description: 'Mật khẩu mới' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  newPassword: string;

  @ApiProperty({ description: 'Phương thức xác thực: EMAIL | PHONE' })
  @IsNotEmpty()
  @IsEnum(['EMAIL', 'PHONE'])
  method: 'EMAIL' | 'PHONE';
}

export class VerifyLoginOtpDto {
  @ApiProperty({ description: 'Định danh tài khoản (Email/Phone)' })
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @ApiProperty({ description: 'Mã OTP' })
  @IsNotEmpty()
  @IsString()
  otpCode: string;

  @ApiProperty({ description: 'Phương thức gửi: EMAIL | PHONE' })
  @IsNotEmpty()
  @IsEnum(['EMAIL', 'PHONE'])
  method: 'EMAIL' | 'PHONE';
}

export class VerifyEmailDto {
  @ApiProperty({ description: 'Email cần xác thực' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Mã OTP xác thực' })
  @IsNotEmpty()
  @IsString()
  otpCode: string;
}

export class ResendVerificationDto {
  @ApiProperty({ description: 'Email cần gửi lại mã xác thực' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Họ và tên khách hàng' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Giới tính' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Ngày sinh' })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;
}
