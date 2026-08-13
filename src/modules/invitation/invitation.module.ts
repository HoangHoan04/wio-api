import {
  GuestRepository,
  InvitationRepository,
  SlugHistoryRepository,
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
      GuestRepository,
      TableRepository,
      WishRepository,
    ]),
  ],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {}
