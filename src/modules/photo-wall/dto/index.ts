import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

/* ============================================================
 * CREATE (Admin)
 * ============================================================ */
export class CreatePhotoWallDto {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @IsUUID()
  @IsNotEmpty()
  invitationId: string;

  @ApiPropertyOptional({ description: 'ID khách mời (null = ẩn danh)' })
  @IsOptional()
  @IsUUID()
  guestId?: string;

  @ApiProperty({ description: 'Tên người tải ảnh lên' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  uploaderName: string;

  @ApiProperty({ description: 'URL ảnh' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ description: 'Storage key trên cloud' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  storageKey?: string;

  @ApiPropertyOptional({ description: 'Chú thích ảnh' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  caption?: string;

  @ApiPropertyOptional({ description: 'Đã duyệt?' })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}

/* ============================================================
 * UPDATE (Admin/User)
 * KHÔNG cho phép đổi invitationId, guestId
 * ============================================================ */
export class UpdatePhotoWallDto extends PartialType(
  // chỉ cho sửa các field này
  class {
    uploaderName?: string;
    url?: string;
    storageKey?: string;
    caption?: string;
    isApproved?: boolean;
  } as any,
) {
  @ApiProperty({ description: 'ID ảnh' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ description: 'Tên người tải ảnh lên' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  uploaderName?: string;

  @ApiPropertyOptional({ description: 'URL ảnh' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ description: 'Storage key' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  storageKey?: string;

  @ApiPropertyOptional({ description: 'Chú thích ảnh' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  caption?: string;

  @ApiPropertyOptional({ description: 'Đã duyệt?' })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}

/* ============================================================
 * FILTER
 * ============================================================ */
export class FilterPhotoWallDto {
  @ApiPropertyOptional({ description: 'ID thiệp cưới' })
  @IsOptional()
  @IsUUID()
  invitationId?: string;

  @ApiPropertyOptional({ description: 'ID khách mời' })
  @IsOptional()
  @IsUUID()
  guestId?: string;

  @ApiPropertyOptional({ description: 'Tên người tải ảnh lên' })
  @IsOptional()
  @IsString()
  uploaderName?: string;

  @ApiPropertyOptional({ description: 'Đã duyệt?' })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}

/* ============================================================
 * PUBLIC — Upload ẩn danh / có mã mời
 * ============================================================ */
export class PublicUploadPhotoWallDto {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @IsUUID()
  @IsNotEmpty()
  invitationId: string;

  @ApiPropertyOptional({
    description: 'Mã mời của khách (nếu có) — dùng để liên kết guest',
  })
  @IsOptional()
  @IsString()
  invitationCode?: string;

  @ApiProperty({ description: 'Tên người tải ảnh lên' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  uploaderName: string;

  @ApiProperty({ description: 'URL ảnh' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ description: 'Storage key' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  storageKey?: string;

  @ApiPropertyOptional({ description: 'Chú thích ảnh' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  caption?: string;
}

/* ============================================================
 * APPROVE/REJECT
 * ============================================================ */
export class RejectPhotoWallDto {
  @ApiProperty({ description: 'ID ảnh' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ description: 'Lý do từ chối' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
