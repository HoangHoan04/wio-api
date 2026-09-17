import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { UserDto } from '@/dto';
import { Body, Controller, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import {
  ChangePasswordDto,
  LogoutDto,
  RefreshTokenDto,
  UpdatePasswordDto,
  UserLoginDto,
} from '../dto';

@ApiTags('Auth - Admin')
@ApiBearerAuth()
@Controller('auth')
export class AuthAdminController {
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

  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshTokenDto) {
    return this.service.refreshToken(data);
  }

  /* ============================================================
   * PROFILE (Cần đăng nhập Admin)
   * ============================================================ */
  @UseGuards(JwtAuthGuard)
  @Post('me')
  async getUserInfo(@CurrentUser() user: UserDto) {
    return this.service.getUserInfo(user);
  }

  /* ============================================================
   * MẬT KHẨU
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
