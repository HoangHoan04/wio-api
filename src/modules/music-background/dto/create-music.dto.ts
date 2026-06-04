import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMusicBackgroundDto {
  @ApiProperty({ description: 'Tên bài hát' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Tác giả', required: false })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ description: 'Thời lượng', required: false })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({ description: 'URL nhạc trực tiếp', required: false })
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiProperty({ description: 'Trạng thái hoạt động', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
