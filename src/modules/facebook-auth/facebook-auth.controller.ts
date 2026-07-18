import { Controller, Get, Ip, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';

@Controller('auth/facebook')
export class FacebookAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('callback')
  async facebookCallback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Req() req: Request,
    @Res() res: Response,
    @Ip() ipAddress: string,
  ) {
    if (error) {
      const frontendUrl =
        process.env.FACEBOOK_FRONTEND_REDIRECT_URL || 'http://localhost:2504';
      return res.redirect(`${frontendUrl}?error=${error}`);
    }
    try {
      const result = await this.authService.handleFacebookCallback(
        code,
        req.headers['user-agent'],
        ipAddress,
      );
      const frontendUrl =
        process.env.FACEBOOK_FRONTEND_REDIRECT_URL || 'http://localhost:2504';
      const redirectUrl = `${frontendUrl}?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`;
      return res.redirect(redirectUrl);
    } catch (err: any) {
      const frontendUrl =
        process.env.FACEBOOK_FRONTEND_REDIRECT_URL || 'http://localhost:2504';
      return res.redirect(
        `${frontendUrl}?error=${encodeURIComponent(err.message || 'Facebook đăng nhập thất bại')}`,
      );
    }
  }
}
