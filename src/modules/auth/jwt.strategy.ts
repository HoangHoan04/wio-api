import { enumData } from '@/common/constanst/enumData';
import { UserRepository } from '@/repositories';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly configService: ConfigService,
    private readonly userRepo: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: {
    uid?: string;
    sub?: string;
    isRefreshToken?: boolean;
  }) {
    if (payload.isRefreshToken)
      throw new UnauthorizedException(
        'Không thể dùng refresh token để xác thực',
      );

    const userId = payload.uid || payload.sub;
    const user = await this.userRepo.findOne({
      where: { id: userId, isDeleted: false },
    });

    if (!user) throw new UnauthorizedException('Không có quyền truy cập!');
    if (!user.isActive)
      throw new UnauthorizedException('Tài khoản đã bị ngưng hoạt động');

    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      role: user.role,
      isAdmin:
        user.isAdmin || user.role === enumData.USER_ROLE.ADMIN.code,
    };
  }
}
