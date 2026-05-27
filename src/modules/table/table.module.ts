import {
  GuestRepository,
  TableRepository,
  WeddingRepository,
} from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { TableService } from './table.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TableRepository,
      GuestRepository,
      WeddingRepository,
    ]),
  ],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
