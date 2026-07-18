import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, Matches } from 'class-validator';

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
}
