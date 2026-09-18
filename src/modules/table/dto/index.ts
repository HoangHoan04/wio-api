import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
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
 * CREATE
 * ============================================================ */
export class CreateTableDto {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @IsUUID()
  @IsNotEmpty()
  invitationId: string;

  @ApiProperty({ description: 'Tên bàn (Bàn 1, Bàn VIP…)' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: 'Số ghế tối đa' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  maxSeats: number;

  @ApiPropertyOptional({ description: 'Mô tả' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ description: 'Vị trí X trên sơ đồ (px)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  positionX?: number;

  @ApiPropertyOptional({ description: 'Vị trí Y trên sơ đồ (px)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  positionY?: number;

  @ApiPropertyOptional({ description: 'Hình dạng bàn' })
  @IsOptional()
  @IsString()
  shape?: string;
}

/* ============================================================
 * UPDATE — KHÔNG cho đổi invitationId
 * ============================================================ */
export class UpdateTableDto {
  @ApiProperty({ description: 'ID bàn tiệc' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({ description: 'Tên bàn' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ description: 'Số ghế tối đa' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  maxSeats?: number;

  @ApiPropertyOptional({ description: 'Mô tả' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ description: 'Vị trí X' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  positionX?: number;

  @ApiPropertyOptional({ description: 'Vị trí Y' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  positionY?: number;

  @ApiPropertyOptional({ description: 'Hình dạng bàn' })
  @IsOptional()
  @IsString()
  shape?: string;
}

/* ============================================================
 * FILTER
 * ============================================================ */
export class FilterTableDto {
  @ApiPropertyOptional({ description: 'ID thiệp cưới' })
  @IsOptional()
  @IsUUID()
  invitationId?: string;

  @ApiPropertyOptional({ description: 'Tên bàn' })
  @IsOptional()
  @IsString()
  name?: string;
}

/* ============================================================
 * ASSIGN / UNASSIGN
 * ============================================================ */
export class AssignGuestDto {
  @ApiProperty({ description: 'ID bàn tiệc' })
  @IsUUID()
  @IsNotEmpty()
  tableId: string;

  @ApiProperty({ description: 'ID khách mời' })
  @IsUUID()
  @IsNotEmpty()
  guestId: string;
}

export class UnassignGuestDto {
  @ApiProperty({ description: 'ID khách mời' })
  @IsUUID()
  @IsNotEmpty()
  guestId: string;
}
