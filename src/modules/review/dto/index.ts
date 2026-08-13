import { enumData } from '@/common/constanst/enumData';
import { IsEnumCode } from '@/common/decorators';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Tên người đánh giá' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  authorName: string;

  @ApiProperty({ description: 'Nội dung đánh giá' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Số sao (1-5)', minimum: 1, maximum: 5 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Nhãn hiển thị', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  eventLabel?: string;

  @ApiProperty({ description: 'Ảnh đại diện', required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ enum: enumData.CARD_TYPE, required: false })
  @IsOptional()
  @IsEnumCode(enumData.CARD_TYPE)
  cardType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  invitationId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiProperty({ enum: enumData.REVIEW_STATUS, required: false })
  @IsOptional()
  @IsEnumCode(enumData.REVIEW_STATUS)
  status?: string;
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterReviewDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  authorName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnumCode(enumData.REVIEW_STATUS)
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnumCode(enumData.CARD_TYPE)
  cardType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

export class PublicCreateReviewDto {
  @ApiProperty({ description: 'Tên người đánh giá' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  authorName: string;

  @ApiProperty({ description: 'Nội dung đánh giá' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Số sao (1-5)', minimum: 1, maximum: 5 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Nhãn hiển thị', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  eventLabel?: string;

  @ApiProperty({ enum: enumData.CARD_TYPE, required: false })
  @IsOptional()
  @IsEnumCode(enumData.CARD_TYPE)
  cardType?: string;
}

export class PublicReviewListDto {
  @ApiProperty({ required: false, default: 6 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24)
  take?: number;
}
