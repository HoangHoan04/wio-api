import {
  GuestRepository,
  SlugHistoryRepository,
  TableRepository,
  WeddingRepository,
  WishRepository,
} from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { WeddingService } from './wedding.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      WeddingRepository,
      SlugHistoryRepository,
      GuestRepository,
      TableRepository,
      WishRepository,
    ]),
  ],
  providers: [WeddingService],
  exports: [WeddingService],
})
export class WeddingModule {}
