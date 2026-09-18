import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { mkdir, readdir, rm } from 'fs/promises';
import * as path from 'path';
import youtubedl from 'youtube-dl-exec';
import {
  DownloadOptions,
  IYoutubeAudioProvider,
  YoutubeAudioInfo,
  YoutubeAudioResult,
} from '../interfaces';

const YT_DLP_FLAGS = {
  noWarnings: true,
  noPlaylist: true,
  noCheckCertificates: true,
  preferFreeFormats: true,
} as const;

@Injectable()
export class YoutubeDlExecProvider implements IYoutubeAudioProvider {
  readonly name = 'youtube-dl-exec';
  private readonly logger = new Logger(YoutubeDlExecProvider.name);

  async getInfo(url: string): Promise<YoutubeAudioInfo> {
    try {
      this.logger.log(`[${this.name}] Fetching info for ${url}`);
      const info = (await youtubedl(url, {
        ...YT_DLP_FLAGS,
        dumpJson: true,
        skipDownload: true,
      })) as any;
      return this.mapInfo(info, url);
    } catch (error: any) {
      const message = this.errorMessage(error);
      this.logger.error(`[${this.name}] Failed to get info: ${message}`);
      throw new BadRequestException(`Không thể lấy thông tin YouTube: ${message}`);
    }
  }

  async downloadAudio(
    url: string,
    options: DownloadOptions = {},
  ): Promise<YoutubeAudioResult> {
    const info = await this.getInfo(url);
    this.validateDuration(info, options.maxDurationSeconds);

    const tmpDir = path.resolve(
      process.cwd(),
      'tmp',
      'youtube',
      `yt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    );
    await mkdir(tmpDir, { recursive: true });
    const outputTemplate = path.join(tmpDir, 'audio.%(ext)s');

    try {
      this.logger.log(`[${this.name}] Downloading audio to ${tmpDir}`);
      await youtubedl(url, {
        ...YT_DLP_FLAGS,
        output: outputTemplate,
        format: options.format === 'mp3' ? 'bestaudio/best' : 'bestaudio/best',
        noPart: true,
      });

      const files = (await readdir(tmpDir)).filter(
        (file) => file.startsWith('audio.') && !file.endsWith('.part'),
      );
      const audioFile = files[0];
      if (!audioFile) {
        throw new InternalServerErrorException(
          'Không tìm thấy file audio sau khi tải',
        );
      }

      const filePath = path.join(tmpDir, audioFile);
      this.logger.log(`[${this.name}] Downloaded ${audioFile}`);
      return {
        info,
        filePath,
        mimeType: this.mimeFromExt(path.extname(audioFile)),
      };
    } catch (error: any) {
      await rm(tmpDir, { force: true, recursive: true }).catch(() => undefined);
      const message = this.errorMessage(error);
      this.logger.warn(`[${this.name}] Download failed: ${message}`);
      throw new InternalServerErrorException(`Tải nhạc thất bại: ${message}`);
    }
  }

  private mimeFromExt(ext: string): string {
    switch (ext.replace('.', '').toLowerCase()) {
      case 'mp3':
        return 'audio/mpeg';
      case 'm4a':
      case 'mp4':
        return 'audio/mp4';
      case 'ogg':
      case 'opus':
        return 'audio/ogg';
      default:
        return 'audio/webm';
    }
  }

  private errorMessage(error: any): string {
    const chunks = [error?.stderr, error?.shortMessage, error?.message]
      .filter((value) => typeof value === 'string' && value.trim())
      .map((value: string) => value.trim());
    return [...new Set(chunks)].join(' — ') || 'yt-dlp exited with an error';
  }

  private mapInfo(raw: any, url: string): YoutubeAudioInfo {
    const source = raw?.entries?.[0] || raw;
    const durationSeconds = parseInt(source.duration, 10) || 0;
    return {
      id: source.id || '',
      title: source.title || 'Unknown Title',
      author: source.uploader || source.channel || 'Unknown Author',
      durationSeconds,
      durationText: this.formatDuration(durationSeconds),
      thumbnail:
        source.thumbnail ||
        source.thumbnails?.[source.thumbnails.length - 1]?.url ||
        '',
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
