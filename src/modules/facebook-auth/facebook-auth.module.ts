import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FacebookAuthController } from './facebook-auth.controller';

@Module({
  imports: [AuthModule],
  controllers: [FacebookAuthController],
})
export class FacebookAuthModule {}
