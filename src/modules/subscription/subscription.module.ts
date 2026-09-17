import { ServicePlanRepository, SubscriptionRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { ActionLogModule } from '../action-log/action-log.module';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      SubscriptionRepository,
      ServicePlanRepository,
    ]),
    ActionLogModule,
  ],
  controllers: [],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
