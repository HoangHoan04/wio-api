import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

/* ============================================================
 * BASE — Thông tin cặp đôi
 * ============================================================ */
export class WeddingInfoDto {
  /* ---- Cô dâu ---- */
  @ApiProperty({ description: 'Tên cô dâu' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  brideName: string;

  @ApiPropertyOptional({ description: 'Tên ngắn cô dâu' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  brideShortName?: string;

  @ApiPropertyOptional({ description: 'URL ảnh cô dâu' })
  @IsOptional()
  @IsString()
  bridePhotoUrl?: string;

  @ApiPropertyOptional({ description: 'Tên bố cô dâu' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  brideFatherName?: string;

  @ApiPropertyOptional({ description: 'Tên mẹ cô dâu' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  brideMotherName?: string;

  @ApiPropertyOptional({ description: 'Tiểu sử cô dâu' })
  @IsOptional()
  @IsString()
  brideBio?: string;

  @ApiPropertyOptional({ description: 'MXH cô dâu (facebook, instagram…)' })
  @IsOptional()
  @IsObject()
  brideSocial?: Record<string, string>;

  /* ---- Chú rể ---- */
  @ApiProperty({ description: 'Tên chú rể' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  groomName: string;

  @ApiPropertyOptional({ description: 'Tên ngắn chú rể' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  groomShortName?: string;

  @ApiPropertyOptional({ description: 'URL ảnh chú rể' })
  @IsOptional()
  @IsString()
  groomPhotoUrl?: string;

  @ApiPropertyOptional({ description: 'Tên bố chú rể' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  groomFatherName?: string;

  @ApiPropertyOptional({ description: 'Tên mẹ chú rể' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  groomMotherName?: string;

  @ApiPropertyOptional({ description: 'Tiểu sử chú rể' })
  @IsOptional()
  @IsString()
  groomBio?: string;

  @ApiPropertyOptional({ description: 'MXH chú rể' })
  @IsOptional()
  @IsObject()
  groomSocial?: Record<string, string>;

  /* ---- Chung ---- */
  @ApiPropertyOptional({ description: 'Ngày bắt đầu yêu nhau' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  loveStartedAt?: Date;

  @ApiPropertyOptional({ description: 'Câu chuyện tình yêu' })
  @IsOptional()
  @IsString()
  loveStory?: string;

  @ApiPropertyOptional({ description: 'Hashtag cưới' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  hashtag?: string;
}

/* ============================================================
 * CREATE (chỉ Admin hoặc khi tạo Invitation)
 * ============================================================ */
export class CreateWeddingInfoDto extends WeddingInfoDto {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @IsUUID()
  @IsNotEmpty()
  invitationId: string;
}

/* ============================================================
 * UPDATE
 * ============================================================ */
export class UpdateWeddingInfoDto extends PartialType(WeddingInfoDto) {
  @ApiProperty({ description: 'ID wedding info' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

/* ============================================================
 * FILTER
 * ============================================================ */
export class FilterWeddingInfoDto {
  @ApiPropertyOptional({ description: 'ID thiệp cưới' })
  @IsOptional()
  @IsUUID()
  invitationId?: string;

  @ApiPropertyOptional({ description: 'Tên cô dâu' })
  @IsOptional()
  @IsString()
  brideName?: string;

  @ApiPropertyOptional({ description: 'Tên chú rể' })
  @IsOptional()
  @IsString()
  groomName?: string;

  @ApiPropertyOptional({ description: 'Hashtag' })
  @IsOptional()
  @IsString()
  hashtag?: string;
}
