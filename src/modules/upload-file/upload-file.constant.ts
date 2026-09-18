/* ============================================================
 * FOLDERS
 * ============================================================ */
export const UPLOAD_FOLDER = {
  IMAGE: 'wio-images',
  AUDIO: 'wio-audio',
  AUDIO_BACKGROUND: 'wio-audio-background',
  DOCUMENT: 'wio-documents',
} as const;

/* ============================================================
 * MIME TYPES
 * ============================================================ */
export const IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif',
] as const;

export const AUDIO_MIMES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/opus',
  'audio/webm',
  'audio/mp4',
  'audio/x-m4a',
  'audio/aac',
] as const;

export const DOCUMENT_MIMES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
] as const;

export const ALL_ALLOWED_MIMES = [
  ...IMAGE_MIMES,
  ...AUDIO_MIMES,
  ...DOCUMENT_MIMES,
] as const;

/* ============================================================
 * LIMITS
 * ============================================================ */
export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_FILES_PER_REQUEST = 20;
export const CATBOX_TIMEOUT_MS = 30_000;

/* ============================================================
 * STORAGE
 * ============================================================ */
export const STORAGE_PROVIDER = {
  CLOUDINARY: 'cloudinary',
  CATBOX: 'catbox',
} as const;

export type StorageProvider =
  (typeof STORAGE_PROVIDER)[keyof typeof STORAGE_PROVIDER];

/* ============================================================
 * RESPONSE TYPES
 * ============================================================ */
export interface UploadResult {
  fileName: string;
  fileUrl: string;
  storage: StorageProvider;
}
