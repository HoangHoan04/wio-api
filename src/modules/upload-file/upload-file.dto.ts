import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

/* ============================================================
 * REQUEST
 * ============================================================ */
export class UploadCatboxFromUrlDto {
  @ApiProperty({ description: 'URL file cần upload' })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @MaxLength(2000)
  url: string;
}

/* ============================================================
 * RESPONSE
 * ============================================================ */
export class UploadResultDto {
  @ApiProperty({ description: 'Tên file sau khi upload' })
  fileName: string;

  @ApiProperty({ description: 'URL file công khai' })
  fileUrl: string;

  @ApiProperty({
    description: 'Nhà cung cấp lưu trữ',
    enum: ['cloudinary', 'catbox'],
  })
  storage: string;
}
