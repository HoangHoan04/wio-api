import {
  GuestRepository,
  SubscriptionRepository,
  UserRepository,
  WeddingRepository,
} from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsAdminController } from './controllers/analytics-admin.controller';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      WeddingRepository,
      GuestRepository,
      SubscriptionRepository,
    ]),
  ],
  controllers: [AnalyticsAdminController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
export * from './analytics.service';
export * from './controllers/analytics-admin.controller';
