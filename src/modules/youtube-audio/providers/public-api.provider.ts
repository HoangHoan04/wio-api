import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  DownloadOptions,
  IYoutubeAudioProvider,
  YoutubeAudioInfo,
  YoutubeAudioResult,
} from '../interfaces';

interface PublicApiMetadata {
  id: string;
  title: string;
  author: string;
  durationSeconds: number;
  thumbnail?: string;
}

@Injectable()
export class PublicApiProvider implements IYoutubeAudioProvider {
  readonly name = 'public-api';
  private readonly logger = new Logger(PublicApiProvider.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getInfo(url: string): Promise<YoutubeAudioInfo> {
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      throw new BadRequestException('Link YouTube không hợp lệ');
    }

    const metadata = await this.fetchMetadata(videoId);
    return {
      ...metadata,
      durationText: this.formatDuration(metadata.durationSeconds),
      youtubeUrl: url,
    };
  }

  async downloadAudio(
    url: string,
    options: DownloadOptions = {},
  ): Promise<YoutubeAudioResult> {
    const info = await this.getInfo(url);
    this.validateDuration(info, options.maxDurationSeconds);

    const directUrl = await this.fetchDownloadUrl(url, options);
    return {
      info,
      directUrl,
      mimeType: 'audio/mpeg',
    };
  }

  private async fetchMetadata(videoId: string): Promise<PublicApiMetadata> {
    const apiUrl =
      this.configService.get<string>('YOUTUBE_PUBLIC_METADATA_API') ||
      `https://yt.lemnoslife.com/videos?part=snippet,contentDetails&id=${videoId}`;

    try {
      this.logger.log(`[${this.name}] Fetching metadata from ${apiUrl}`);
      const { data } = await firstValueFrom(this.httpService.get(apiUrl));

      const item = data?.items?.[0];
      if (!item) {
        throw new BadRequestException('Không tìm thấy video');
      }

      const snippet = item.snippet || {};
      const contentDetails = item.contentDetails || {};
      const durationIso = contentDetails.duration || 'PT0S';

      return {
        id: videoId,
        title: snippet.title || 'Unknown Title',
        author: snippet.channelTitle || 'Unknown Author',
        durationSeconds: this.parseIsoDuration(durationIso),
        thumbnail:
          snippet.thumbnails?.maxres?.url ||
          snippet.thumbnails?.standard?.url ||
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          snippet.thumbnails?.default?.url ||
          '',
      };
    } catch (error: any) {
      this.logger.error(
        `[${this.name}] Metadata fetch failed: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Lỗi khi gọi public API lấy metadata: ${error.message}`,
      );
    }
  }

  private async fetchDownloadUrl(
    url: string,
    options: DownloadOptions,
  ): Promise<string> {
    const downloadApi =
      this.configService.get<string>('YOUTUBE_PUBLIC_DOWNLOAD_API') ||
      'https://api.cobalt.tools/api/json';

    try {
      this.logger.log(
        `[${this.name}] Fetching download URL from ${downloadApi}`,
      );
      const { data } = await firstValueFrom(
        this.httpService.post(
          downloadApi,
          {
            url,
            downloadMode: 'audio',
            audioFormat: options.format || 'mp3',
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            timeout: 30000,
          },
        ),
      );

      if (data?.url) {
        return data.url;
      }
      if (data?.link) {
        return data.link;
      }

      throw new Error(
        `Public API response không chứa link tải: ${JSON.stringify(data)}`,
      );
    } catch (error: any) {
      this.logger.error(
        `[${this.name}] Download URL fetch failed: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Lỗi khi gọi public API lấy link tải: ${error.message}`,
      );
    }
  }

  private extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) return match[1];
    }
    return null;
  }

  private parseIsoDuration(iso: string): number {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);
    return hours * 3600 + minutes * 60 + seconds;
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
