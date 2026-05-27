import { WeddingPhotoRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { WeddingPhotoService } from './wedding-photo.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([WeddingPhotoRepository])],
  providers: [WeddingPhotoService],
  exports: [WeddingPhotoService],
})
export class WeddingPhotoModule {}
