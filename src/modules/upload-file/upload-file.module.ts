import { ChildModule } from '@/common/decorators/module.decorator';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PREFIX_MODULE } from '../config-module';
import { MAX_FILE_SIZE_BYTES } from './upload-file.constant';
import { UploadFileController } from './upload-file.controller';
import { UploadFileService } from './upload-file.service';

@ChildModule({
  prefix: PREFIX_MODULE.upload,
  controllers: [UploadFileController],
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: MAX_FILE_SIZE_BYTES,
        files: 20,
      },
    }),
  ],
  providers: [UploadFileService],
  exports: [UploadFileService],
})
export class UploadFileModule {}
