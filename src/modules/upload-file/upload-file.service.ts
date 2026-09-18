import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { randomBytes } from 'crypto';
import { createReadStream, existsSync } from 'fs';
import { lookup as lookupMimeExt } from 'mime-types';
import {
  ALL_ALLOWED_MIMES,
  AUDIO_MIMES,
  CATBOX_TIMEOUT_MS,
  DOCUMENT_MIMES,
  IMAGE_MIMES,
  STORAGE_PROVIDER,
  UPLOAD_FOLDER,
  UploadResult,
} from './upload-file.constant';

@Injectable()
export class UploadFileService {
  private readonly logger = new Logger(UploadFileService.name);
  private readonly catboxApiUrl = 'https://catbox.moe/user/api.php';
  private readonly catboxUserhash: string;

  constructor(private readonly configService: ConfigService) {
    this.catboxUserhash =
      this.configService.get<string>('CATBOX_USERHASH') || '';

    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      throw new InternalServerErrorException(
        'Thiếu cấu hình Cloudinary (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)',
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  /* ============================================================
   * HELPER
   * ============================================================ */
  private generateFileId(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const random = randomBytes(6).toString('hex');
    return `${y}${m}${d}-${random}`;
  }

  private getExtension(mimetype: string, fallback = 'bin'): string {
    const ext = lookupMimeExt(mimetype);
    if (ext && ext !== 'bin') return ext;
    const fromMime: Record<string, string> = {
      'audio/mpeg': 'mp3',
      'audio/mp3': 'mp3',
      'audio/wav': 'wav',
      'audio/ogg': 'ogg',
      'audio/opus': 'ogg',
      'audio/webm': 'webm',
      'audio/mp4': 'm4a',
      'audio/x-m4a': 'm4a',
      'audio/aac': 'aac',
      'video/webm': 'webm',
      'video/mp4': 'mp4',
    };
    return fromMime[mimetype] || fallback;
  }

  private detectFileCategory(
    mimetype: string,
  ): 'image' | 'audio' | 'document' | 'other' {
    if ((IMAGE_MIMES as readonly string[]).includes(mimetype)) return 'image';
    if ((AUDIO_MIMES as readonly string[]).includes(mimetype)) return 'audio';
    if ((DOCUMENT_MIMES as readonly string[]).includes(mimetype)) {
      return 'document';
    }
    return 'other';
  }

  private assertFile(file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Chưa có file được tải lên');
    }
    if (!(ALL_ALLOWED_MIMES as readonly string[]).includes(file.mimetype)) {
      throw new BadRequestException(
        `Định dạng file không được hỗ trợ: ${file.mimetype}`,
      );
    }
  }

  private assertStream(stream?: NodeJS.ReadableStream) {
    if (!stream) {
      throw new BadRequestException('Chưa có stream được cung cấp');
    }
  }

  /* ============================================================
   * CLOUDINARY — Buffer upload
   * ============================================================ */
  private async uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadResult> {
    const fileId = this.generateFileId();
    const ext = this.getExtension(file.mimetype);

    const options: UploadApiOptions = {
      folder,
      public_id: fileId,
      resource_type: 'auto',
    };

    try {
      const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const result: UploadApiResponse = await cloudinary.uploader.upload(
        base64,
        options,
      );
      return {
        fileName: `${fileId}.${ext}`,
        fileUrl: result.secure_url,
        storage: STORAGE_PROVIDER.CLOUDINARY,
      };
    } catch (err) {
      this.logger.error('Cloudinary upload thất bại', err);
      throw new InternalServerErrorException(
        `Upload Cloudinary thất bại: ${this.extractErrorMessage(err)}`,
      );
    }
  }

  /* ============================================================
   * CLOUDINARY — Stream upload
   * ============================================================ */
  private uploadStreamToCloudinary(
    stream: NodeJS.ReadableStream,
    folder: string,
    mimeType: string,
    fileExt?: string,
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const fileId = this.generateFileId();
      const ext = (fileExt || this.getExtension(mimeType, 'mp3'))
        .replace('.', '')
        .toLowerCase();
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: fileId,
          resource_type: 'video',
        },
        (error, result) => {
          if (error) {
            return reject(
              new InternalServerErrorException(
                `Upload Cloudinary stream thất bại: ${error.message}`,
              ),
            );
          }
          if (!result) {
            return reject(
              new InternalServerErrorException(
                'Cloudinary trả về kết quả rỗng',
              ),
            );
          }
          resolve({
            fileName: `${fileId}.${ext}`,
            fileUrl: result.secure_url,
            storage: STORAGE_PROVIDER.CLOUDINARY,
          });
        },
      );

      stream.on('error', (err) => {
        reject(new InternalServerErrorException(`Lỗi stream: ${err.message}`));
      });

      stream.pipe(uploadStream);
    });
  }

  /* ============================================================
   * CATBOX
   * ============================================================ */
  private async catboxRequest(formData: FormData): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CATBOX_TIMEOUT_MS);

    try {
      const response = await fetch(this.catboxApiUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Catbox API trả về status ${response.status}`);
      }

      const fileUrl = (await response.text()).trim();
      if (!fileUrl || !fileUrl.startsWith('http')) {
        throw new Error(`Catbox trả về URL không hợp lệ: ${fileUrl}`);
      }

      return fileUrl;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async uploadFileToCatbox(
    file: Express.Multer.File,
  ): Promise<UploadResult> {
    const ext = this.getExtension(file.mimetype);
    const fileName = `${this.generateFileId()}.${ext}`;

    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    if (this.catboxUserhash) {
      formData.append('userhash', this.catboxUserhash);
    }
    const blob = new Blob([new Uint8Array(file.buffer)], {
      type: file.mimetype,
    });
    formData.append('fileToUpload', blob, fileName);

    try {
      const fileUrl = await this.catboxRequest(formData);
      return {
        fileName,
        fileUrl,
        storage: STORAGE_PROVIDER.CATBOX,
      };
    } catch (err) {
      this.logger.error('Catbox upload thất bại', err);
      throw new InternalServerErrorException(
        `Upload Catbox thất bại: ${this.extractErrorMessage(err)}`,
      );
    }
  }

  private async uploadUrlToCatbox(url: string): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('reqtype', 'urlupload');
    if (this.catboxUserhash) {
      formData.append('userhash', this.catboxUserhash);
    }
    formData.append('url', url);

    try {
      const fileUrl = await this.catboxRequest(formData);
      const fileName = url.split('/').pop() || `${this.generateFileId()}.bin`;
      return {
        fileName,
        fileUrl,
        storage: STORAGE_PROVIDER.CATBOX,
      };
    } catch (err) {
      this.logger.error('Catbox upload từ URL thất bại', err);
      throw new InternalServerErrorException(
        `Upload URL lên Catbox thất bại: ${this.extractErrorMessage(err)}`,
      );
    }
  }

  /* ============================================================
   * PUBLIC API — Image
   * ============================================================ */
  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadResult> {
    this.assertFile(file);
    return this.uploadToCloudinary(file, folder || UPLOAD_FOLDER.IMAGE);
  }

  /* ============================================================
   * PUBLIC API — Audio
   * ============================================================ */
  async uploadAudio(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadResult> {
    this.assertFile(file);
    return this.uploadToCloudinary(file, folder || UPLOAD_FOLDER.AUDIO);
  }

  async uploadAudioFromStream(
    stream: NodeJS.ReadableStream,
    folder?: string,
    mimeType = 'audio/webm',
  ): Promise<UploadResult> {
    this.assertStream(stream);
    return this.uploadStreamToCloudinary(
      stream,
      folder || UPLOAD_FOLDER.AUDIO_BACKGROUND,
      mimeType,
    );
  }

  async uploadAudioFromFilePath(
    filePath: string,
    folder?: string,
    mimeType = 'audio/mpeg',
  ): Promise<UploadResult> {
    if (!filePath) {
      throw new BadRequestException('Chưa có đường dẫn file');
    }
    if (!existsSync(filePath)) {
      throw new BadRequestException(`File không tồn tại: ${filePath}`);
    }

    const stream = createReadStream(filePath);
    const ext = filePath.includes('.')
      ? filePath.split('.').pop()?.toLowerCase()
      : undefined;
    return this.uploadStreamToCloudinary(
      stream,
      folder || UPLOAD_FOLDER.AUDIO_BACKGROUND,
      mimeType,
      ext,
    );
  }

  /* ============================================================
   * PUBLIC API — Document
   * ============================================================ */
  async uploadDocument(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadResult> {
    this.assertFile(file);
    return this.uploadToCloudinary(file, folder || UPLOAD_FOLDER.DOCUMENT);
  }

  /* ============================================================
   * PUBLIC API — Catbox
   * ============================================================ */
  async uploadCatbox(file: Express.Multer.File): Promise<UploadResult> {
    this.assertFile(file);
    return this.uploadFileToCatbox(file);
  }

  async uploadToCatboxFromUrl(url: string): Promise<UploadResult> {
    if (!url) throw new BadRequestException('URL là bắt buộc');
    return this.uploadUrlToCatbox(url);
  }

  /* ============================================================
   * PUBLIC API — Auto detect
   * ============================================================ */
  async uploadSingle(file: Express.Multer.File): Promise<UploadResult> {
    this.assertFile(file);
    const category = this.detectFileCategory(file.mimetype);

    switch (category) {
      case 'image':
        return this.uploadImage(file);
      case 'audio':
        return this.uploadAudio(file);
      case 'document':
      default:
        return this.uploadDocument(file);
    }
  }

  async uploadMulti(
    files: Array<Express.Multer.File>,
  ): Promise<UploadResult[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Danh sách file trống');
    }
    return Promise.all(files.map((f) => this.uploadSingle(f)));
  }

  /* ============================================================
   * PRIVATE — Extract message từ unknown error
   * ============================================================ */
  private extractErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === 'object' && err !== null) {
      const e = err as { error?: { message?: string }; message?: string };
      return e.error?.message || e.message || JSON.stringify(err);
    }
    return String(err);
  }
}
