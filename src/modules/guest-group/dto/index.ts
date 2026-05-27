import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateGuestGroupDto {
  @ApiProperty({ description: 'ID Đám cưới' })
  @IsNotEmpty()
  @IsString()
  weddingId: string;

  @ApiProperty({ description: 'Tên nhóm (Họ hàng, Bạn thân...)' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Mã màu HEX để hiển thị trên UI',
    required: false,
  })
  @IsOptional()
  @IsString()
  colorLabel?: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp' })
  @IsNotEmpty()
  @IsNumber()
  sortOrder: number;
}

export class UpdateGuestGroupDto extends PartialType(CreateGuestGroupDto) {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterGuestGroupDto {
  @ApiProperty({ description: 'ID Đám cưới', required: false })
  @IsOptional()
  @IsString()
  weddingId?: string;

  @ApiProperty({
    description: 'Tên nhóm (Họ hàng, Bạn thân...)',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Mã màu HEX để hiển thị trên UI',
    required: false,
  })
  @IsOptional()
  @IsString()
  colorLabel?: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp', required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
