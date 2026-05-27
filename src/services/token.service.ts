import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(userId: string) {}

  generateRefreshToken(userId: string) {}

  hashToken(token: string) {}

  compareToken(plainToken: string, hashedToken: string) {}

  verifyRefreshToken(token: string) {}
}
