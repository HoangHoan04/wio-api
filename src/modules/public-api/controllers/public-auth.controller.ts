import { Body, Controller, Ip, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from '../../auth/auth.service';
import { RefreshTokenDto, RegisterDto, UserLoginDto } from '../../auth/dto';

@ApiTags('Public - Auth')
@Controller('auth')
export class PublicAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản cặp đôi' })
  async register(@Body() data: RegisterDto) {
    return await this.authService.register(data);
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập cặp đôi' })
  async login(
    @Body() data: UserLoginDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    return await this.authService.login(
      data,
      req.headers['user-agent'],
      ipAddress,
    );
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Làm mới access token' })
  async refresh(@Body() data: RefreshTokenDto) {
    return await this.authService.refreshToken(data);
  }
}
