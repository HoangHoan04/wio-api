import { MusicBackgroundRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { UploadFileModule } from '../upload-file/upload-file.module';
import { YoutubeAudioModule } from '../youtube-audio/youtube-audio.module';
import { MusicBackgroundAdminController } from './controllers/music-background-admin.controller';
import { MusicBackgroundUserController } from './controllers/music-background-user.controller';
import { MusicBackgroundProcessor } from './music-background.processor';
import { MusicBackgroundService } from './music-background.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([MusicBackgroundRepository]),
    UploadFileModule,
    YoutubeAudioModule,
    BullModule.registerQueue({
      name: 'youtube-import',
    }),
  ],
  controllers: [MusicBackgroundUserController, MusicBackgroundAdminController],
  providers: [MusicBackgroundService, MusicBackgroundProcessor],
  exports: [MusicBackgroundService],
})
export class MusicBackgroundModule {}
