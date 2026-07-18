import { GuestRepository, WeddingRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { GuestService } from './guest.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([GuestRepository, WeddingRepository]),
    MulterModule.register({ storage: memoryStorage() }),
  ],
  providers: [GuestService],
  exports: [GuestService],
})
export class GuestModule {}
