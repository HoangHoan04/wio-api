import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import {
  YOUTUBE_IMPORT_JOB,
  YOUTUBE_IMPORT_QUEUE,
} from './constants/music-background.constant';
import {
  MusicBackgroundService,
  YoutubeJobData,
} from './music-background.service';

@Processor(YOUTUBE_IMPORT_QUEUE)
export class MusicBackgroundProcessor {
  private readonly logger = new Logger(MusicBackgroundProcessor.name);

  constructor(private readonly musicService: MusicBackgroundService) {}

  @Process(YOUTUBE_IMPORT_JOB)
  async handleImport(job: Job<YoutubeJobData>): Promise<void> {
    const { youtubeUrl, provider } = job.data;
    this.logger.log(
      `Processing job ${job.id} — URL=${youtubeUrl} provider=${provider}`,
    );

    try {
      await this.musicService.processYoutube(job.data);
      this.logger.log(`Finished job ${job.id} — URL=${youtubeUrl}`);
    } catch (err: any) {
      this.logger.error(`Job ${job.id} failed: ${err.message}`, err.stack);
      throw err; // để Bull retry theo `attempts`
    }
  }
}
