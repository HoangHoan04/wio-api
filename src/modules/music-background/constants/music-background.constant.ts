/* ============================================================
 * YouTube provider
 * ============================================================ */
export const YOUTUBE_PROVIDERS = [
  'youtube-dl-exec',
  'public-api',
  'python-yt-dlp',
] as const;

export type YoutubeProvider = (typeof YOUTUBE_PROVIDERS)[number];

export const DEFAULT_YOUTUBE_PROVIDER: YoutubeProvider = 'python-yt-dlp';

/** Giới hạn thời lượng video nhạc nền tối đa (giây) */
export const MAX_YOUTUBE_DURATION_SECONDS = 600;

/* ============================================================
 * Storage
 * ============================================================ */
export const MUSIC_AUDIO_BUCKET = 'wio-audio-background';

/* ============================================================
 * Queue
 * ============================================================ */
export const YOUTUBE_IMPORT_QUEUE = 'youtube-import';
export const YOUTUBE_IMPORT_JOB = 'import';
export const QUEUE_TIMEOUT_MS = 1000;
