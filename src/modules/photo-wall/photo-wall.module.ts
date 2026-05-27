import { PhotoWallRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { PhotoWallService } from './photo-wall.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([PhotoWallRepository])],
  providers: [PhotoWallService],
  exports: [PhotoWallService],
})
export class PhotoWallModule {}
