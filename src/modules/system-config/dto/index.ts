import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSystemConfigDto {
  @ApiProperty({ description: 'Mã định danh duy nhất cho cấu hình' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: 'Tên hiển thị của cấu hình' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Loại: string | number | boolean | json' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ description: 'Giá trị cấu hình dưới dạng JSON' })
  @IsNotEmpty()
  value: any;
}

export class UpdateSystemConfigDto extends PartialType(CreateSystemConfigDto) {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterSystemConfigDto {
  @ApiProperty({
    description: 'Mã định danh duy nhất cho cấu hình',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Tên hiển thị của cấu hình', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Loại: string | number | boolean | json',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'Giá trị cấu hình dưới dạng JSON',
    required: false,
  })
  @IsOptional()
  value?: any;
}
