import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  YOUTUBE_PROVIDERS,
  YoutubeProvider,
} from '../constants/music-background.constant';
import { normalizeYoutubeUrl } from '../utils/youtube-url.util';

/* ============================================================
 * CREATE
 * ============================================================ */
export class CreateMusicBackgroundDto {
  @ApiProperty({ description: 'Tên bài nhạc nền' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Tác giả' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ description: 'Thời lượng (VD: 3:45)' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ description: 'URL file âm thanh trực tiếp' })
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiPropertyOptional({ description: 'URL gốc YouTube' })
  @IsOptional()
  @IsString()
  youtubeUrl?: string;

  @ApiPropertyOptional({ description: 'URL ảnh thumbnail' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ description: 'Trạng thái hoạt động', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Phân loại nguồn nhạc',
    enum: enumData.MUSIC_TYPE,
  })
  @IsOptional()
  @IsEnum(enumData.MUSIC_TYPE)
  type?: string;
}

/* ============================================================
 * UPDATE
 * ============================================================ */
export class UpdateMusicBackgroundDto extends PartialType(
  CreateMusicBackgroundDto,
) {
  @ApiProperty({ description: 'ID nhạc nền' })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

/* ============================================================
 * IMPORT YOUTUBE
 * ============================================================ */
export class ImportYoutubeDto {
  @ApiProperty({
    description: 'URL của video YouTube',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @Transform(({ value }) => normalizeYoutubeUrl(String(value ?? '')))
  @IsNotEmpty({ message: 'Link YouTube không được để trống' })
  @IsString()
  youtubeUrl: string;

  @ApiPropertyOptional({
    description: 'Provider tải nhạc',
    enum: YOUTUBE_PROVIDERS,
  })
  @IsOptional()
  @IsIn(YOUTUBE_PROVIDERS)
  provider?: YoutubeProvider;

  @ApiPropertyOptional({
    description: 'Phân loại nguồn nhạc',
    enum: enumData.MUSIC_TYPE,
  })
  @IsOptional()
  @IsEnum(enumData.MUSIC_TYPE)
  type?: string;
}

/* ============================================================
 * GET YOUTUBE INFO
 * ============================================================ */
export class GetYoutubeInfoDto {
  @ApiProperty({
    description: 'URL của video YouTube',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @Transform(({ value }) => normalizeYoutubeUrl(String(value ?? '')))
  @IsNotEmpty({ message: 'Link YouTube không được để trống' })
  @IsString()
  url: string;

  @ApiPropertyOptional({
    description: 'Provider lấy metadata',
    enum: YOUTUBE_PROVIDERS,
  })
  @IsOptional()
  @IsIn(YOUTUBE_PROVIDERS)
  provider?: YoutubeProvider;
}

/* ============================================================
 * CANCEL IMPORT
 * ============================================================ */
export class CancelImportDto {
  @ApiProperty({ description: 'URL YouTube cần huỷ import' })
  @Transform(({ value }) => normalizeYoutubeUrl(String(value ?? '')))
  @IsNotEmpty()
  @IsString()
  url: string;
}

/* ============================================================
 * FILTER
 * ============================================================ */
export class FilterMusicBackgroundDto {
  @ApiPropertyOptional({ description: 'Tên bài hát' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Tác giả' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ description: 'Đang hoạt động?' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Trạng thái xử lý',
    enum: enumData.MUSIC_STATUS,
  })
  @IsOptional()
  @IsEnum(enumData.MUSIC_STATUS)
  status?: string;

  @ApiPropertyOptional({
    description: 'Loại nguồn nhạc',
    enum: enumData.MUSIC_TYPE,
  })
  @IsOptional()
  @IsEnum(enumData.MUSIC_TYPE)
  type?: string;
}
