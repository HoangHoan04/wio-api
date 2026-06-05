import { MusicBackgroundRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { UploadFileModule } from '../upload-file/upload-file.module';
import { MusicBackgroundUserController } from './controllers/music-background-user.controller';
import { MusicBackgroundService } from './music-background.service';
import { MusicQueueProcessor } from './music-queue.processor';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([MusicBackgroundRepository]),
    BullModule.registerQueue({
      name: 'music-queue',
    }),
    UploadFileModule,
  ],
  controllers: [MusicBackgroundUserController],
  providers: [MusicBackgroundService, MusicQueueProcessor],
  exports: [MusicBackgroundService],
})
export class MusicBackgroundModule {}
