import { Controller, Get, Ip, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Req() req: Request,
    @Res() res: Response,
    @Ip() ipAddress: string,
  ) {
    if (error) {
      const frontendUrl =
        process.env.GOOGLE_FRONTEND_REDIRECT_URL || 'http://localhost:2504';
      const redirectUrl = new URL(frontendUrl);
      redirectUrl.searchParams.set('error', error);
      return res.redirect(redirectUrl.toString());
    }
    try {
      const result = await this.authService.handleGoogleCallback(
        code,
        req.headers['user-agent'],
        ipAddress,
      );
      const frontendUrl =
        process.env.GOOGLE_FRONTEND_REDIRECT_URL || 'http://localhost:2504';
      const redirectUrl = new URL(frontendUrl);
      redirectUrl.searchParams.set('accessToken', result.accessToken);
      redirectUrl.searchParams.set('refreshToken', result.refreshToken);
      return res.redirect(redirectUrl.toString());
    } catch (err: any) {
      const frontendUrl =
        process.env.GOOGLE_FRONTEND_REDIRECT_URL || 'http://localhost:2504';
      const redirectUrl = new URL(frontendUrl);
      redirectUrl.searchParams.set(
        'error',
        err.message || 'Google đăng nhập thất bại',
      );
      return res.redirect(redirectUrl.toString());
    }
  }
}
