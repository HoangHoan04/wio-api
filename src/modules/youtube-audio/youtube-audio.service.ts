import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DownloadOptions,
  IYoutubeAudioProvider,
  YoutubeAudioInfo,
  YoutubeAudioResult,
} from './interfaces';
import {
  PublicApiProvider,
  PythonYtDlpProvider,
  YoutubeDlExecProvider,
} from './providers';

export type YoutubeAudioProviderType =
  | 'youtube-dl-exec'
  | 'public-api'
  | 'python-yt-dlp';

@Injectable()
export class YoutubeAudioService {
  private readonly logger = new Logger(YoutubeAudioService.name);
  private readonly providers: Map<string, IYoutubeAudioProvider> = new Map();
  private readonly defaultProvider: YoutubeAudioProviderType;

  constructor(
    private readonly configService: ConfigService,
    private readonly youtubeDlExecProvider: YoutubeDlExecProvider,
    private readonly publicApiProvider: PublicApiProvider,
    private readonly pythonYtDlpProvider: PythonYtDlpProvider,
  ) {
    this.providers.set('youtube-dl-exec', youtubeDlExecProvider);
    this.providers.set('public-api', publicApiProvider);
    this.providers.set('python-yt-dlp', pythonYtDlpProvider);

    const configured = this.configService.get<YoutubeAudioProviderType>(
      'YOUTUBE_AUDIO_PROVIDER',
    );
    this.defaultProvider = configured || 'python-yt-dlp';
  }

  getInfo(
    url: string,
    providerName?: YoutubeAudioProviderType,
  ): Promise<YoutubeAudioInfo> {
    return this.withFallback(providerName, (provider) => provider.getInfo(url));
  }

  async downloadAudio(
    url: string,
    providerName?: YoutubeAudioProviderType,
    options?: DownloadOptions,
  ): Promise<YoutubeAudioResult> {
    return this.withFallback(providerName, (provider) => {
      this.logger.log(`[${provider.name}] Downloading audio from ${url}`);
      return provider.downloadAudio(url, options);
    });
  }

  async getDirectAudioUrl(
    url: string,
    providerName?: YoutubeAudioProviderType,
    options?: DownloadOptions,
  ): Promise<{ info: YoutubeAudioInfo; url: string; mimeType?: string }> {
    const result = await this.downloadAudio(url, providerName, options);

    if (result.directUrl) {
      return {
        info: result.info,
        url: result.directUrl,
        mimeType: result.mimeType,
      };
    }

    if (result.filePath) {
      return {
        info: result.info,
        url: `file://${result.filePath}`,
        mimeType: result.mimeType,
      };
    }

    throw new InternalServerErrorException(
      `Provider ${result.info ? 'returned' : 'did not return'} a usable audio URL`,
    );
  }

  listProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  private async withFallback<T>(
    preferred: YoutubeAudioProviderType | undefined,
    run: (provider: IYoutubeAudioProvider) => Promise<T>,
  ): Promise<T> {
    const order = this.providerOrder(preferred);
    let lastError: Error | null = null;

    for (const name of order) {
      const provider = this.providers.get(name);
      if (!provider) continue;
      try {
        return await run(provider);
      } catch (error: any) {
        lastError = error;
        if (this.isNonRetryable(error)) throw error;
        this.logger.warn(
          `[${provider.name}] failed, trying next provider: ${error.message}`,
        );
      }
    }

    throw (
      lastError ||
      new InternalServerErrorException('Không thể tải nhạc từ YouTube')
    );
  }

  private providerOrder(
    preferred?: YoutubeAudioProviderType,
  ): YoutubeAudioProviderType[] {
    const all: YoutubeAudioProviderType[] = [
      'python-yt-dlp',
      'public-api',
      'youtube-dl-exec',
    ];
    const first = preferred || this.defaultProvider;
    return [first, ...all.filter((name) => name !== first)];
  }

  private isNonRetryable(error: any): boolean {
    const message = String(error?.message || '');
    return message.includes('quá dài') || message.includes('không hợp lệ');
  }
}
