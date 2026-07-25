import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';

export class ImportYoutubeDto {
  @ApiProperty({
    description: 'URL của video YouTube',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @IsNotEmpty()
  @IsUrl()
  @Matches(/^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/, {
    message: 'Link YouTube không hợp lệ',
  })
  youtubeUrl: string;

  @ApiProperty({
    description:
      'Provider tải nhạc: youtube-dl-exec | public-api | python-yt-dlp',
    example: 'youtube-dl-exec',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['youtube-dl-exec', 'public-api', 'python-yt-dlp'])
  provider?: 'youtube-dl-exec' | 'public-api' | 'python-yt-dlp';

  @ApiProperty({ description: 'Phân loại nguồn', default: 'admin', required: false })
  @IsOptional()
  @IsString()
  type?: string;
}
