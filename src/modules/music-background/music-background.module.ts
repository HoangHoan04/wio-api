import { MusicBackgroundRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { UploadFileModule } from '../upload-file/upload-file.module';
import { MusicBackgroundUserController } from './controllers/music-background-user.controller';
import { MusicBackgroundService } from './music-background.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([MusicBackgroundRepository]),
    UploadFileModule,
  ],
  controllers: [MusicBackgroundUserController],
  providers: [MusicBackgroundService],
  exports: [MusicBackgroundService],
})
export class MusicBackgroundModule {}
