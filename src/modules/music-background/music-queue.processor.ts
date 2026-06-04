import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MusicProcessStatus } from '@/entities/music-background.entity';
import ytdl from 'ytdl-core';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Logger } from '@nestjs/common';
import { MusicBackgroundRepository } from '@/repositories';

@Processor('music-queue')
export class MusicQueueProcessor {
  private readonly logger = new Logger(MusicQueueProcessor.name);

  constructor(
    private readonly musicRepo: MusicBackgroundRepository
  ) {}

  @Process('download-youtube')
  async handleDownloadYoutube(job: Job<{ musicId: string; youtubeUrl: string }>) {
    const { musicId, youtubeUrl } = job.data;

    // 1. Update status to PROCESSING
    await this.musicRepo.update(musicId, { status: MusicProcessStatus.PROCESSING });
    this.logger.log(`Processing youtube download for musicId: ${musicId}`);

    try {
      // 2. Get Video Info
      const info = await ytdl.getInfo(youtubeUrl);
      const title = info.videoDetails.title;
      const author = info.videoDetails.author.name;
      const lengthSeconds = parseInt(info.videoDetails.lengthSeconds, 10);

      // Validate length (max 10 minutes = 600 seconds)
      if (lengthSeconds > 600) {
        throw new Error('Video quá dài (vượt quá 10 phút)');
      }

      const minutes = Math.floor(lengthSeconds / 60);
      const seconds = lengthSeconds % 60;
      const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      // Update basic info while downloading
      await this.musicRepo.update(musicId, {
        name: title,
        author: author,
        duration: duration,
      });

      // 3. Download and Upload stream
      const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'video', // Cloudinary uses video for audio files
            folder: 'wio-audio-background',
            public_id: `yt_${musicId}`,
          },
          (error, result) => {
            if (error) return reject(error);
            if (result) return resolve(result);
          }
        );

        const videoStream = ytdl(youtubeUrl, { quality: 'highestaudio', filter: 'audioonly' });

        videoStream.on('error', (err) => {
          this.logger.error(`ytdl error: ${err.message}`);
          reject(err);
        });

        videoStream.pipe(uploadStream);
      });

      // 4. Update status to COMPLETED
      await this.musicRepo.update(musicId, {
        status: MusicProcessStatus.COMPLETED,
        audioUrl: uploadResult.secure_url,
      });

      this.logger.log(`Completed youtube download for musicId: ${musicId}`);
    } catch (error: any) {
      this.logger.error(`Failed to process youtube download for musicId: ${musicId} - ${error.message}`);
      // 5. Fallback to FAILED
      await this.musicRepo.update(musicId, {
        status: MusicProcessStatus.FAILED,
        name: `Lỗi: ${error.message}`,
      });
      throw error; // Let Bull know it failed
    }
  }
}
