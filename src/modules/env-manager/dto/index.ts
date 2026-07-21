import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEnvFileDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class EnvFileResponseDto {
  project: string;
  environment: string;
  path: string;
  content: string;
  updatedAt: Date;
}

export class EnvFileListItemDto {
  project: string;
  environment: string;
  path: string;
  updatedAt: Date;
}
