export interface YoutubeAudioInfo {
  id: string;
  title: string;
  author: string;
  durationSeconds: number;
  durationText: string;
  thumbnail?: string;
  youtubeUrl: string;
}

export interface YoutubeAudioResult {
  info: YoutubeAudioInfo;
  stream?: NodeJS.ReadableStream;
  directUrl?: string;
  filePath?: string;
  mimeType?: string;
}

export interface IYoutubeAudioProvider {
  name: string;
  getInfo(url: string): Promise<YoutubeAudioInfo>;
  downloadAudio(
    url: string,
    options?: DownloadOptions,
  ): Promise<YoutubeAudioResult>;
}

export interface DownloadOptions {
  outputPath?: string;
  format?: 'bestaudio' | 'mp3' | 'm4a';
  maxDurationSeconds?: number;
}
