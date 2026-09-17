import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/* ============================================================
 * CREATE (Admin)
 * ============================================================ */
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

  @ApiPropertyOptional({
    description: 'Nhãn hiển thị (VD: Thiệp cưới · 12/2025)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  eventLabel?: string;

  @ApiPropertyOptional({ description: 'URL ảnh đại diện' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Phong cách cưới',
    enum: enumData.WEDDING_THEME,
  })
  @IsOptional()
  @IsEnum(enumData.WEDDING_THEME)
  weddingTheme?: string;

  @ApiPropertyOptional({ description: 'ID thiệp liên quan' })
  @IsOptional()
  @IsUUID()
  invitationId?: string;

  @ApiPropertyOptional({ description: 'ID user gửi đánh giá' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái',
    enum: enumData.REVIEW_STATUS,
    default: enumData.REVIEW_STATUS.PENDING.code,
  })
  @IsOptional()
  @IsEnum(enumData.REVIEW_STATUS)
  status?: string;

  @ApiPropertyOptional({ description: 'Ghim lên trang chủ' })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiPropertyOptional({ description: 'Thứ tự hiển thị' })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

/* ============================================================
 * UPDATE (Admin)
 * ============================================================ */
export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @ApiProperty({ description: 'ID đánh giá' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

/* ============================================================
 * FILTER (Admin)
 * ============================================================ */
export class FilterReviewDto {
  @ApiPropertyOptional({ description: 'Tên người đánh giá' })
  @IsOptional()
  @IsString()
  authorName?: string;

  @ApiPropertyOptional({ description: 'ID thiệp liên quan' })
  @IsOptional()
  @IsUUID()
  invitationId?: string;

  @ApiPropertyOptional({ description: 'ID user gửi' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Phong cách cưới',
    enum: enumData.WEDDING_THEME,
  })
  @IsOptional()
  @IsEnum(enumData.WEDDING_THEME)
  weddingTheme?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái',
    enum: enumData.REVIEW_STATUS,
  })
  @IsOptional()
  @IsEnum(enumData.REVIEW_STATUS)
  status?: string;

  @ApiPropertyOptional({ description: 'Đã ghim?' })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiPropertyOptional({ description: 'Số sao tối thiểu' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  ratingMin?: number;

  @ApiPropertyOptional({ description: 'Số sao tối đa' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  ratingMax?: number;
}

/* ============================================================
 * PUBLIC — Khách gửi đánh giá
 * ============================================================ */
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

  @ApiPropertyOptional({ description: 'Nhãn hiển thị' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  eventLabel?: string;

  @ApiPropertyOptional({
    description: 'Phong cách cưới',
    enum: enumData.WEDDING_THEME,
  })
  @IsOptional()
  @IsEnum(enumData.WEDDING_THEME)
  weddingTheme?: string;

  @ApiPropertyOptional({ description: 'ID thiệp liên quan (nếu có)' })
  @IsOptional()
  @IsUUID()
  invitationId?: string;
}

/* ============================================================
 * PUBLIC — Danh sách cho trang chủ
 * ============================================================ */
export class PublicReviewListDto {
  @ApiPropertyOptional({ description: 'Số lượng trả về', default: 6 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24)
  take?: number;

  @ApiPropertyOptional({
    description: 'Phong cách cưới',
    enum: enumData.WEDDING_THEME,
  })
  @IsOptional()
  @IsEnum(enumData.WEDDING_THEME)
  weddingTheme?: string;

  @ApiPropertyOptional({ description: 'Số sao tối thiểu' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  ratingMin?: number;
}
