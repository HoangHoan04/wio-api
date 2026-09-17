import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

/* ============================================================
 * CREATE DTO
 * ============================================================ */
export class ActionLogCreateDto {
  @ApiProperty({ description: 'ID người dùng thực hiện hành động' })
  @IsNotEmpty()
  @IsUUID()
  createdById: string;

  @ApiProperty({ description: 'Mã người dùng thực hiện hành động' })
  @IsNotEmpty()
  @IsString()
  createdByCode: string;

  @ApiProperty({ description: 'Tên người dùng thực hiện hành động' })
  @IsNotEmpty()
  @IsString()
  createdByName: string;

  @ApiPropertyOptional({ description: 'Ghi chú bổ sung về hành động' })
  @IsOptional()
  @IsString()
  createdNote?: string;

  @ApiPropertyOptional({
    description: 'Loại hành động',
    enum: enumData.ACTION_TYPE,
  })
  @IsOptional()
  @IsString()
  actionType?: string;

  @ApiPropertyOptional({ description: 'ID thực thể bị tác động' })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiPropertyOptional({ description: 'Tên bảng thực thể bị tác động' })
  @IsOptional()
  @IsString()
  entityName?: string;

  @ApiPropertyOptional({ description: 'Giá trị cũ của thực thể (JSON)' })
  @IsOptional()
  @IsObject()
  oldValue?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Giá trị mới của thực thể (JSON)' })
  @IsOptional()
  @IsObject()
  newValue?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Địa chỉ IP của người dùng' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'Chuỗi User-Agent của trình duyệt' })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Vị trí địa lý ước tính' })
  @IsOptional()
  @IsString()
  location?: string;
}

/* ============================================================
 * FILTER DTO (dùng cho pagination)
 * ============================================================ */
export class ActionLogFilterDto {
  @ApiPropertyOptional({ description: 'ID thực thể bị tác động' })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiPropertyOptional({ description: 'Tên bảng thực thể bị tác động' })
  @IsOptional()
  @IsString()
  entityName?: string;

  @ApiPropertyOptional({
    description: 'Loại hành động',
    enum: enumData.ACTION_TYPE,
  })
  @IsOptional()
  @IsString()
  actionType?: string;

  @ApiPropertyOptional({ description: 'ID người thực hiện hành động' })
  @IsOptional()
  @IsUUID()
  createdById?: string;

  @ApiPropertyOptional({ description: 'Tên người thực hiện hành động' })
  @IsOptional()
  @IsString()
  createdByName?: string;
}
