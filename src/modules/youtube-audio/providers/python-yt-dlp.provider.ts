import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import * as path from 'path';
import { mkdir, rm } from 'fs/promises';
import {
  DownloadOptions,
  IYoutubeAudioProvider,
  YoutubeAudioInfo,
  YoutubeAudioResult,
} from '../interfaces';

interface PythonScriptResult {
  success: boolean;
  info?: YoutubeAudioInfo;
  filePath?: string;
  mimeType?: string;
  error?: string;
}

@Injectable()
export class PythonYtDlpProvider implements IYoutubeAudioProvider {
  readonly name = 'python-yt-dlp';
  private readonly logger = new Logger(PythonYtDlpProvider.name);

  constructor(private readonly configService: ConfigService) {}

  async getInfo(url: string): Promise<YoutubeAudioInfo> {
    const result = await this.runPython(url, { infoOnly: true });
    if (!result.success || !result.info) {
      throw new BadRequestException(
        result.error || 'Không thể lấy thông tin video',
      );
    }
    return result.info;
  }

  async downloadAudio(
    url: string,
    options: DownloadOptions = {},
  ): Promise<YoutubeAudioResult> {
    const tmpDir = path.resolve(
      this.configService.get<string>('YOUTUBE_PYTHON_TMP_DIR') || 'tmp/youtube',
    );
    await mkdir(tmpDir, { recursive: true });

    const outputPath = path.join(
      tmpDir,
      `yt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    );

    const result = await this.runPython(url, {
      outputPath,
      format: options.format || 'mp3',
      maxDuration: options.maxDurationSeconds || 600,
    });

    if (!result.success || !result.filePath || !result.info) {
      await this.safeCleanup(outputPath);
      throw new InternalServerErrorException(
        result.error || 'Tải nhạc thất bại',
      );
    }

    return {
      info: result.info,
      filePath: result.filePath,
      mimeType: result.mimeType,
    };
  }

  private async runPython(
    url: string,
    options: {
      infoOnly?: boolean;
      outputPath?: string;
      format?: string;
      maxDuration?: number;
    },
  ): Promise<PythonScriptResult> {
    const pythonExecutable =
      this.configService.get<string>('YOUTUBE_PYTHON_EXECUTABLE') || 'python';
    const scriptPath = this.resolveScriptPath();

    const args = [
      scriptPath,
      '--url',
      url,
      '--max-duration',
      String(options.maxDuration || 600),
    ];

    if (options.infoOnly) {
      args.push('--info-only');
    } else {
      args.push('--output', options.outputPath!);
      args.push('--format', options.format || 'mp3');
    }

    return new Promise((resolve, reject) => {
      this.logger.log(
        `[${this.name}] Running: ${pythonExecutable} ${args.join(' ')}`,
      );
      const proc = spawn(pythonExecutable, args, {
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('error', (err) => {
        this.logger.error(`[${this.name}] Process error: ${err.message}`);
        reject(
          new InternalServerErrorException(
            `Không thể chạy Python script: ${err.message}`,
          ),
        );
      });

      proc.on('close', (code) => {
        if (code !== 0) {
          this.logger.error(
            `[${this.name}] Python exited with code ${code}: ${stderr}`,
          );
          return resolve({
            success: false,
            error: stderr || `Python process exited with code ${code}`,
          });
        }

        try {
          const parsed = JSON.parse(stdout) as PythonScriptResult;
          resolve(parsed);
        } catch (err: any) {
          this.logger.error(
            `[${this.name}] Failed to parse Python output: ${err.message}`,
          );
          resolve({
            success: false,
            error: `Invalid Python output: ${stdout}`,
          });
        }
      });
    });
  }

  private resolveScriptPath(): string {
    const configured = this.configService.get<string>('YOUTUBE_PYTHON_SCRIPT');
    if (configured) return path.resolve(configured);

    const candidates = [
      // Development (src)
      path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'scripts',
        'youtube_download.py',
      ),
      // Compiled (dist): scripts copied next to dist or project root
      path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'scripts',
        'youtube_download.py',
      ),
      // Project root
      path.resolve(process.cwd(), 'scripts', 'youtube_download.py'),
    ];

    for (const candidate of candidates) {
      if (existsSync(candidate)) return candidate;
    }

    // Fallback to project root location
    return path.resolve(process.cwd(), 'scripts', 'youtube_download.py');
  }

  private async safeCleanup(outputPath: string): Promise<void> {
    try {
      await rm(outputPath, { force: true, recursive: true });
    } catch {
      // ignore cleanup errors
    }
  }
}
