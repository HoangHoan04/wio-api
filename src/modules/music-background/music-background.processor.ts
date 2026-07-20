import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { YoutubeAudioProviderType } from '../youtube-audio';
import { MusicBackgroundService } from './music-background.service';

@Processor('youtube-import')
export class MusicBackgroundProcessor {
  private readonly logger = new Logger(MusicBackgroundProcessor.name);

  constructor(private readonly musicService: MusicBackgroundService) {}

  @Process('import')
  async handleImport(
    job: Job<{
      youtubeUrl: string;
      title: string;
      author: string;
      duration: string;
      provider: YoutubeAudioProviderType;
    }>,
  ): Promise<void> {
    const { youtubeUrl, provider } = job.data;
    this.logger.log(
      `Processing youtube import job ${job.id} for: ${youtubeUrl} (provider: ${provider})`,
    );
    await this.musicService.processYoutube(job.data);
    this.logger.log(`Finished youtube import job ${job.id} for: ${youtubeUrl}`);
  }
}
