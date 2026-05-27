import { GuestRepository, WeddingRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { GuestService } from './guest.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([GuestRepository, WeddingRepository]),
  ],
  providers: [GuestService],
  exports: [GuestService],
})
export class GuestModule {}
