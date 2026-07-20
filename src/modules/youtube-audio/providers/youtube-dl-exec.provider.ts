import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import youtubedl from 'youtube-dl-exec';
import {
  DownloadOptions,
  IYoutubeAudioProvider,
  YoutubeAudioInfo,
  YoutubeAudioResult,
} from '../interfaces';

@Injectable()
export class YoutubeDlExecProvider implements IYoutubeAudioProvider {
  readonly name = 'youtube-dl-exec';
  private readonly logger = new Logger(YoutubeDlExecProvider.name);

  async getInfo(url: string): Promise<YoutubeAudioInfo> {
    try {
      this.logger.log(`[${this.name}] Fetching info for ${url}`);
      const info = (await youtubedl(url, {
        dumpJson: true,
        noWarnings: true,
      })) as any;
      return this.mapInfo(info, url);
    } catch (error: any) {
      this.logger.error(`[${this.name}] Failed to get info: ${error.message}`);
      throw new BadRequestException(
        `Không thể lấy thông tin YouTube: ${error.message}`,
      );
    }
  }

  async downloadAudio(
    url: string,
    options: DownloadOptions = {},
  ): Promise<YoutubeAudioResult> {
    const info = await this.getInfo(url);
    this.validateDuration(info, options.maxDurationSeconds);

    try {
      this.logger.log(`[${this.name}] Starting audio download for ${url}`);
      const subprocess = youtubedl.exec(
        url,
        {
          output: '-',
          format: options.format || 'bestaudio',
          noWarnings: true,
        },
        { stdio: ['ignore', 'pipe', 'ignore'] },
      );

      if (!subprocess.stdout) {
        throw new InternalServerErrorException('Không thể khởi động stream');
      }

      return { info, stream: subprocess.stdout, mimeType: 'audio/webm' };
    } catch (error: any) {
      this.logger.error(`[${this.name}] Download failed: ${error.message}`);
      throw new InternalServerErrorException(
        `Tải nhạc thất bại: ${error.message}`,
      );
    }
  }

  private mapInfo(raw: any, url: string): YoutubeAudioInfo {
    const durationSeconds = parseInt(raw.duration, 10) || 0;
    return {
      id: raw.id || '',
      title: raw.title || 'Unknown Title',
      author: raw.uploader || raw.channel || 'Unknown Author',
      durationSeconds,
      durationText: this.formatDuration(durationSeconds),
      thumbnail:
        raw.thumbnail || raw.thumbnails?.[raw.thumbnails.length - 1]?.url || '',
      youtubeUrl: url,
    };
  }

  private formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  private validateDuration(
    info: YoutubeAudioInfo,
    maxDurationSeconds?: number,
  ): void {
    const limit = maxDurationSeconds ?? 600;
    if (info.durationSeconds > limit) {
      throw new BadRequestException(
        `Video quá dài (${info.durationText}), giới hạn ${Math.floor(limit / 60)} phút`,
      );
    }
  }
}
