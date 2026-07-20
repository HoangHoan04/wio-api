import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import {
  PublicApiProvider,
  PythonYtDlpProvider,
  YoutubeDlExecProvider,
} from './providers';
import { YoutubeAudioService } from './youtube-audio.service';

@Module({
  imports: [HttpModule],
  providers: [
    YoutubeDlExecProvider,
    PublicApiProvider,
    PythonYtDlpProvider,
    YoutubeAudioService,
  ],
  exports: [YoutubeAudioService],
})
export class YoutubeAudioModule {}
