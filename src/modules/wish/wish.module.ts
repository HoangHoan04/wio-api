import { WishRepository, InvitationRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { WishService } from './wish.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      WishRepository,
      InvitationRepository,
    ]),
  ],
  providers: [WishService],
  exports: [WishService],
})
export class WishModule {}
