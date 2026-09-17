import { JwtAuthGuard } from '@/common/guards';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MAX_FILES_PER_REQUEST } from './upload-file.constant';
import { UploadCatboxFromUrlDto } from './upload-file.dto';
import { UploadFileService } from './upload-file.service';

@ApiTags('UploadFile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload-file')
export class UploadFileController {
  constructor(private readonly service: UploadFileService) {}

  /* ============================================================
   * SINGLE
   * ============================================================ */
  @Post('upload-single')
  @ApiOperation({ summary: 'Upload 1 file — tự động phân loại' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadSingle(file);
  }

  /* ============================================================
   * MULTI
   * ============================================================ */
  @Post('upload-multi')
  @ApiOperation({ summary: 'Upload nhiều file — tự động phân loại' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', MAX_FILES_PER_REQUEST))
  async uploadMulti(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Danh sách file trống');
    }
    return this.service.uploadMulti(files);
  }

  /* ============================================================
   * SPECIFIC — Image
   * ============================================================ */
  @Post('upload-image')
  @ApiOperation({ summary: 'Upload ảnh' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadImage(file);
  }

  /* ============================================================
   * SPECIFIC — Audio
   * ============================================================ */
  @Post('upload-audio')
  @ApiOperation({ summary: 'Upload audio' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadAudio(file);
  }

  /* ============================================================
   * SPECIFIC — Document
   * ============================================================ */
  @Post('upload-document')
  @ApiOperation({ summary: 'Upload tài liệu' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadDocument(file);
  }

  /* ============================================================
   * CATBOX
   * ============================================================ */
  @Post('upload-catbox')
  @ApiOperation({ summary: 'Upload file lên Catbox.moe (miễn phí)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCatbox(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadCatbox(file);
  }

  @Post('upload-catbox-url')
  @ApiOperation({ summary: 'Upload từ URL lên Catbox.moe' })
  async uploadCatboxUrl(@Body() body: UploadCatboxFromUrlDto) {
    return this.service.uploadToCatboxFromUrl(body.url);
  }
}
