import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
export class CreateWishDto {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @IsUUID()
  @IsNotEmpty()
  invitationId: string;

  @ApiPropertyOptional({ description: 'ID khách mời (nếu có)' })
  @IsOptional()
  @IsUUID()
  guestId?: string;

  @ApiProperty({ description: 'Tên người gửi' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  guestName: string;

  @ApiProperty({ description: 'Nội dung lời chúc' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Đã duyệt?', default: false })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @ApiPropertyOptional({ description: 'Ghim lên đầu?', default: false })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

/* ============================================================
 * UPDATE (Admin/User)
 * KHÔNG cho đổi invitationId, guestId
 * ============================================================ */
export class UpdateWishDto {
  @ApiProperty({ description: 'ID lời chúc' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ description: 'Tên người gửi' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  guestName?: string;

  @ApiPropertyOptional({ description: 'Nội dung lời chúc' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Đã duyệt?' })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @ApiPropertyOptional({ description: 'Ghim lên đầu?' })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

/* ============================================================
 * FILTER
 * ============================================================ */
export class FilterWishDto {
  @ApiPropertyOptional({ description: 'ID thiệp cưới' })
  @IsOptional()
  @IsUUID()
  invitationId?: string;

  @ApiPropertyOptional({ description: 'ID khách mời' })
  @IsOptional()
  @IsUUID()
  guestId?: string;

  @ApiPropertyOptional({ description: 'Tên người gửi' })
  @IsOptional()
  @IsString()
  guestName?: string;

  @ApiPropertyOptional({ description: 'Đã duyệt?' })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @ApiPropertyOptional({ description: 'Đã ghim?' })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

/* ============================================================
 * PUBLIC — Khách gửi lời chúc
 * ============================================================ */
export class PublicCreateWishDto {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @IsUUID()
  @IsNotEmpty()
  invitationId: string;

  @ApiPropertyOptional({
    description: 'Mã mời của khách (nếu có) — để liên kết guest',
  })
  @IsOptional()
  @IsString()
  invitationCode?: string;

  @ApiProperty({ description: 'Tên người gửi' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  guestName: string;

  @ApiProperty({ description: 'Nội dung lời chúc' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;
}

/* ============================================================
 * PUBLIC — Danh sách lời chúc
 * ============================================================ */
export class PublicWishListDto {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @IsUUID()
  @IsNotEmpty()
  invitationId: string;

  @ApiPropertyOptional({ description: 'Số lượng', default: 20 })
  @IsOptional()
  take?: number;

  @ApiPropertyOptional({ description: 'Bỏ qua', default: 0 })
  @IsOptional()
  skip?: number;
}
