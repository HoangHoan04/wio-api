import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsObject, IsOptional, Min } from 'class-validator';

export class PaginationDto<TWhere = Record<string, any>> {
  @ApiPropertyOptional({ description: 'Số bản ghi bỏ qua', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @ApiPropertyOptional({ description: 'Số bản ghi lấy về', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number = 10;

  @ApiPropertyOptional({ description: 'Điều kiện lọc' })
  @IsOptional()
  @IsObject()
  where?: TWhere;

  @ApiPropertyOptional({
    description: 'Sắp xếp',
    example: { createdAt: 'DESC' },
  })
  @IsOptional()
  @IsObject()
  order?: Record<string, 'ASC' | 'DESC'>;
}
