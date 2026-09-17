import {
  GuestRepository,
  InvitationRepository,
  SlugHistoryRepository,
  SubscriptionRepository,
  TableRepository,
  WishRepository,
} from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      InvitationRepository,
      SlugHistoryRepository,
      SubscriptionRepository,
      GuestRepository,
      TableRepository,
      WishRepository,
    ]),
  ],
  controllers: [],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {}
