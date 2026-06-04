import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { UploadFileModule } from '../upload-file/upload-file.module';
import { MusicBackgroundService } from './music-background.service';
import { MusicBackgroundRepository } from '@/repositories';
import { MusicQueueProcessor } from './music-queue.processor';
import { TypeOrmExModule } from '@/typeorm';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([MusicBackgroundRepository]),
    BullModule.registerQueue({
      name: 'music-queue',
    }),
    UploadFileModule,
  ],
  providers: [MusicBackgroundService, MusicQueueProcessor],
  exports: [MusicBackgroundService],
})
export class MusicBackgroundModule {}
