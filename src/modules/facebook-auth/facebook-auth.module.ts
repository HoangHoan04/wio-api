import { AuthModule } from '@/modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { FacebookAuthController } from './facebook-auth.controller';

@Module({
  imports: [AuthModule],
  controllers: [FacebookAuthController],
})
export class FacebookAuthModule {}
