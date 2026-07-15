import {
  CustomerRepository,
  UserRepository,
  UserTokenRepository,
  VerifyOtpRepository,
} from '@/repositories';
import { OtpService } from '@/services/otp.service';
import { TokenService } from '@/services/token.service';
import { TypeOrmExModule } from '@/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from '../email/email.module';
import { NotificationModule } from '../notification/notification.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRY') || '1h') as any,
        },
      }),
    }),
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      UserTokenRepository,
      CustomerRepository,
      VerifyOtpRepository,
    ]),
    HttpModule,
    EmailModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy, OtpService, TokenService],
  exports: [AuthService, JwtStrategy, PassportModule, TokenService],
})
export class AuthModule {}
