import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { UserDto } from '@/dto';
import {
  Body,
  Controller,
  Get,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service';
import {
  ChangePasswordDto,
  CheckPhoneAndEmailDto,
  FacebookLoginDto,
  ForgotPasswordCustomerDto,
  GoogleLoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResendVerificationDto,
  SendOtpCustomerDto,
  SendOtpVerifyDto,
  UpdatePasswordDto,
  UpdateProfileDto,
  UserLoginDto,
  VerifyEmailDto,
  VerifyLoginOtpDto,
} from '../dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthUserController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  async login(
    @Body() data: UserLoginDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    return await this.service.login(data, req.headers['user-agent'], ipAddress);
  }

  @Post('login/google')
  async loginWithGoogle(
    @Body() data: GoogleLoginDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    return await this.service.loginWithGoogle(
      data,
      req.headers['user-agent'],
      ipAddress,
    );
  }

  @Get('google')
  async getGoogleAuthUrl(@Res() res: Response) {
    try {
      const url = await this.service.getGoogleAuthUrl();
      return res.redirect(url);
    } catch (err: any) {
      const frontendUrl =
        process.env.GOOGLE_FRONTEND_REDIRECT_URL || 'http://localhost:2504';
      const redirectUrl = new URL(frontendUrl);
      redirectUrl.searchParams.set(
        'error',
        err.message || 'Google OAuth chưa được cấu hình',
      );
      return res.redirect(redirectUrl.toString());
    }
  }

  @Post('login/facebook')
  async loginWithFacebook(
    @Body() data: FacebookLoginDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    return await this.service.loginWithFacebook(
      data,
      req.headers['user-agent'],
      ipAddress,
    );
  }

  @Get('facebook')
  async getFacebookAuthUrl(@Res() res: Response) {
    try {
      const url = await this.service.getFacebookAuthUrl();
      return res.redirect(url);
    } catch (err: any) {
      const frontendUrl =
        process.env.FACEBOOK_FRONTEND_REDIRECT_URL || 'http://localhost:2504';
      const redirectUrl = new URL(frontendUrl);
      redirectUrl.searchParams.set(
        'error',
        err.message || 'Facebook OAuth chưa được cấu hình',
      );
      return res.redirect(redirectUrl.toString());
    }
  }

  @Post('check-phone-email')
  async checkPhoneAndEmail(@Body() data: CheckPhoneAndEmailDto) {
    return await this.service.checkPhoneAndEmail(data);
  }

  @Post('send-otp')
  async sendOtpCustomer(@Body() data: SendOtpCustomerDto) {
    return await this.service.sendOtpEmailCustomer(data);
  }

  @Post('send-otp-verify')
  async sendOtpVerify(@Body() data: SendOtpVerifyDto) {
    return await this.service.sendOtpVerify(data);
  }

  @Post('register')
  async register(@Body() data: RegisterDto) {
    return await this.service.register(data);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordCustomerDto) {
    return await this.service.forgotPassword(data);
  }

  @Post('verify-otp')
  async verifyLoginOtp(
    @Body() data: VerifyLoginOtpDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    return await this.service.verifyLoginOtp(
      data,
      req.headers['user-agent'],
      ipAddress,
    );
  }

  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshTokenDto) {
    return await this.service.refreshToken(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-password')
  async updatePassword(
    @Body() info: UpdatePasswordDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.updatePassword(info, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() info: ChangePasswordDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.changePassword(info, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async getUserInfo(@CurrentUser() user: UserDto) {
    return await this.service.getUserInfo(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-profile')
  async updateProfile(
    @CurrentUser() user: UserDto,
    @Body() dto: UpdateProfileDto,
  ) {
    return await this.service.updateProfile(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() user: UserDto,
    @Body() data: { refreshToken?: string },
  ) {
    return await this.service.logout(user, data?.refreshToken);
  }

  @Post('verify-email')
  async verifyEmail(@Body() data: VerifyEmailDto) {
    return await this.service.verifyEmail(data);
  }

  @Post('resend-verification')
  async resendVerification(@Body() data: ResendVerificationDto) {
    return await this.service.resendVerificationEmail(data.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('clean-tokens')
  async cleanExpiredTokens() {
    return await this.service.cleanExpiredTokens();
  }
}
