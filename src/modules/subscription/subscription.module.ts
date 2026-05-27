import { SubscriptionRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([SubscriptionRepository])],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
