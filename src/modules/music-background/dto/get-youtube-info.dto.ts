import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { YoutubeAudioProviderType } from '../../youtube-audio';
import { normalizeYoutubeUrl } from '../utils/youtube-url.util';

export class GetYoutubeInfoDto {
  @ApiProperty({
    description: 'URL của video YouTube',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })
  @Transform(({ value }) => normalizeYoutubeUrl(String(value ?? '')))
  @IsNotEmpty({ message: 'Link YouTube không được để trống' })
  @IsString()
  url: string;

  @ApiProperty({
    description:
      'Provider lấy metadata: youtube-dl-exec | public-api | python-yt-dlp',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['youtube-dl-exec', 'public-api', 'python-yt-dlp'])
  provider?: YoutubeAudioProviderType;
}
