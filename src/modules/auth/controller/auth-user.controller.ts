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
  LogoutDto,
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

@ApiTags('Auth - User')
@ApiBearerAuth()
@Controller('auth')
export class AuthUserController {
  constructor(private readonly service: AuthService) {}

  /* ============================================================
   * ĐĂNG NHẬP
   * ============================================================ */
  @Post('login')
  async login(
    @Body() data: UserLoginDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    return this.service.login(data, req.headers['user-agent'], ipAddress);
  }

  @Post('login/google')
  async loginWithGoogle(
    @Body() data: GoogleLoginDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    return this.service.loginWithGoogle(
      data,
      req.headers['user-agent'],
      ipAddress,
    );
  }

  @Post('login/facebook')
  async loginWithFacebook(
    @Body() data: FacebookLoginDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    return this.service.loginWithFacebook(
      data,
      req.headers['user-agent'],
      ipAddress,
    );
  }

  /* ============================================================
   * OAUTH REDIRECT (Google / Facebook)
   * ============================================================ */
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

  /* ============================================================
   * ĐĂNG KÝ & OTP
   * ============================================================ */
  @Post('check-phone-email')
  async checkPhoneAndEmail(@Body() data: CheckPhoneAndEmailDto) {
    return this.service.checkPhoneAndEmail(data);
  }

  @Post('send-otp')
  async sendOtpCustomer(@Body() data: SendOtpCustomerDto) {
    return this.service.sendOtpEmailCustomer(data);
  }

  @Post('send-otp-verify')
  async sendOtpVerify(@Body() data: SendOtpVerifyDto) {
    return this.service.sendOtpVerify(data);
  }

  @Post('register')
  async register(@Body() data: RegisterDto) {
    return this.service.register(data);
  }

  @Post('verify-otp')
  async verifyLoginOtp(
    @Body() data: VerifyLoginOtpDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    return this.service.verifyLoginOtp(
      data,
      req.headers['user-agent'],
      ipAddress,
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordCustomerDto) {
    return this.service.forgotPassword(data);
  }

  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshTokenDto) {
    return this.service.refreshToken(data);
  }

  /* ============================================================
   * XÁC THỰC EMAIL
   * ============================================================ */
  @Post('verify-email')
  async verifyEmail(@Body() data: VerifyEmailDto) {
    return this.service.verifyEmail(data);
  }

  @Post('resend-verification')
  async resendVerification(@Body() data: ResendVerificationDto) {
    return this.service.resendVerificationEmail(data.email);
  }

  /* ============================================================
   * PROFILE (Cần đăng nhập)
   * ============================================================ */
  @UseGuards(JwtAuthGuard)
  @Post('me')
  async getUserInfo(@CurrentUser() user: UserDto) {
    return this.service.getUserInfo(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-profile')
  async updateProfile(
    @CurrentUser() user: UserDto,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.service.updateProfile(user, dto);
  }

  /* ============================================================
   * MẬT KHẨU (Cần đăng nhập)
   * ============================================================ */
  @UseGuards(JwtAuthGuard)
  @Post('update-password')
  async updatePassword(
    @Body() info: UpdatePasswordDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.updatePassword(info, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() info: ChangePasswordDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.changePassword(info, user);
  }

  /* ============================================================
   * ĐĂNG XUẤT & DỌN TOKEN
   * ============================================================ */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: UserDto, @Body() data: LogoutDto) {
    return this.service.logout(user, data?.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('clean-tokens')
  async cleanExpiredTokens() {
    return this.service.cleanExpiredTokens();
  }
}
