import {
  BadRequestException,
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
    this.defaultProvider = configured || 'youtube-dl-exec';
  }

  getInfo(
    url: string,
    providerName?: YoutubeAudioProviderType,
  ): Promise<YoutubeAudioInfo> {
    const provider = this.resolveProvider(providerName);
    return provider.getInfo(url);
  }

  async downloadAudio(
    url: string,
    providerName?: YoutubeAudioProviderType,
    options?: DownloadOptions,
  ): Promise<YoutubeAudioResult> {
    const provider = this.resolveProvider(providerName);
    this.logger.log(`[${provider.name}] Downloading audio from ${url}`);
    return provider.downloadAudio(url, options);
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

  private resolveProvider(
    name?: YoutubeAudioProviderType,
  ): IYoutubeAudioProvider {
    const providerName = name || this.defaultProvider;
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new BadRequestException(
        `Provider không hợp lệ: ${providerName}. Các provider khả dụng: ${this.listProviders().join(', ')}`,
      );
    }
    return provider;
  }
}
