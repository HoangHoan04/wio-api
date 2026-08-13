import {
  GuestRepository,
  InvitationRepository,
  TemplateRepository,
  UserRepository,
  WishRepository,
} from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      InvitationRepository,
      GuestRepository,
      WishRepository,
      UserRepository,
      TemplateRepository,
    ]),
  ],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
