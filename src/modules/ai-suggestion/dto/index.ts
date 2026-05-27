import { AiTarget, AiTone } from '@/entities/enums';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAiSuggestionDto {
  @ApiProperty({ description: 'ID Đám cưới' })
  @IsNotEmpty()
  @IsString()
  weddingId: string;

  @ApiProperty({ description: 'Nhóm đối tượng', enum: AiTarget })
  @IsNotEmpty()
  @IsEnum(AiTarget)
  targetGroup: AiTarget;

  @ApiProperty({ description: 'Văn phong', enum: AiTone })
  @IsNotEmpty()
  @IsEnum(AiTone)
  tone: AiTone;

  @ApiProperty({ description: 'Ngôn ngữ (vi, en)' })
  @IsNotEmpty()
  @IsString()
  language: string;

  @ApiProperty({ description: 'Yêu cầu bổ sung', required: false })
  @IsOptional()
  @IsString()
  customPrompt?: string;

  @ApiProperty({ description: 'Nội dung sinh ra' })
  @IsNotEmpty()
  @IsString()
  generatedText: string;

  @ApiProperty({
    description: 'Model sử dụng (gemini-pro, gpt-4...)',
    required: false,
  })
  @IsOptional()
  @IsString()
  modelUsed?: string;

  @ApiProperty({ description: 'Số token đã sử dụng', required: false })
  @IsOptional()
  @IsNumber()
  tokensUsed?: number;

  @ApiProperty({ description: 'Đã sử dụng?' })
  @IsNotEmpty()
  @IsBoolean()
  isUsed: boolean;

  @ApiProperty({ description: 'Thời điểm sử dụng', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  usedAt?: Date;
}

export class UpdateAiSuggestionDto extends PartialType(CreateAiSuggestionDto) {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterAiSuggestionDto {
  @ApiProperty({ description: 'ID Đám cưới', required: false })
  @IsOptional()
  @IsString()
  weddingId?: string;

  @ApiProperty({
    description: 'Nhóm đối tượng',
    enum: AiTarget,
    required: false,
  })
  @IsOptional()
  @IsEnum(AiTarget)
  targetGroup?: AiTarget;

  @ApiProperty({ description: 'Văn phong', enum: AiTone, required: false })
  @IsOptional()
  @IsEnum(AiTone)
  tone?: AiTone;

  @ApiProperty({ description: 'Ngôn ngữ (vi, en)', required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ description: 'Yêu cầu bổ sung', required: false })
  @IsOptional()
  @IsString()
  customPrompt?: string;

  @ApiProperty({ description: 'Nội dung sinh ra', required: false })
  @IsOptional()
  @IsString()
  generatedText?: string;

  @ApiProperty({
    description: 'Model sử dụng (gemini-pro, gpt-4...)',
    required: false,
  })
  @IsOptional()
  @IsString()
  modelUsed?: string;

  @ApiProperty({ description: 'Số token đã sử dụng', required: false })
  @IsOptional()
  @IsNumber()
  tokensUsed?: number;

  @ApiProperty({ description: 'Đã sử dụng?', required: false })
  @IsOptional()
  @IsBoolean()
  isUsed?: boolean;

  @ApiProperty({ description: 'Thời điểm sử dụng', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  usedAt?: Date;
}
