import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { UserDto } from '@/dto';
import { Body, Controller, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import {
  ChangePasswordDto,
  RefreshTokenDto,
  UpdatePasswordDto,
  UserLoginDto,
} from '../dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthAdminController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  async login(
    @Body() data: UserLoginDto,
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    return await this.service.login(data, req.headers['user-agent'], ipAddress);
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
  @Post('logout')
  async logout(
    @CurrentUser() user: UserDto,
    @Body() data: { refreshToken?: string },
  ) {
    return await this.service.logout(user, data?.refreshToken);
  }
}
