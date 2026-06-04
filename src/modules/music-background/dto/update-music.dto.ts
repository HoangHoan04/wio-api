import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateMusicBackgroundDto } from './create-music.dto';

export class UpdateMusicBackgroundDto extends PartialType(CreateMusicBackgroundDto) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
