import { AuthService } from '@/modules/auth/auth.service';
import { Controller, Get, Ip, Query, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('Auth - Google')
@Controller('auth/google')
export class GoogleAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private redirectToFrontend(
    res: Response,
    params: Record<string, string>,
  ): void {
    const frontendUrl =
      this.configService.get<string>('GOOGLE_FRONTEND_REDIRECT_URL') ||
      this.configService.get<string>('FRONTEND_URL') ||
      'http://localhost:2504';

    const redirectUrl = new URL(frontendUrl);
    for (const [key, value] of Object.entries(params)) {
      redirectUrl.searchParams.set(key, value);
    }

    res.redirect(redirectUrl.toString());
  }

  @Get('callback')
  @ApiOperation({ summary: 'Callback OAuth từ Google' })
  async googleCallback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Query('error_description') errorDescription: string,
    @Req() req: Request,
    @Res() res: Response,
    @Ip() ipAddress: string,
  ): Promise<void> {
    if (error) {
      return this.redirectToFrontend(res, {
        error: errorDescription || error || 'Google đăng nhập thất bại',
      });
    }

    if (!code) {
      return this.redirectToFrontend(res, {
        error: 'Không nhận được mã xác thực từ Google',
      });
    }

    try {
      const result = await this.authService.handleGoogleCallback(
        code,
        req.headers['user-agent'],
        ipAddress,
      );

      return this.redirectToFrontend(res, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Google đăng nhập thất bại';
      return this.redirectToFrontend(res, { error: message });
    }
  }
}
