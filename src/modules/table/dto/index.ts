import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTableDto {
  @ApiProperty({ description: 'ID Thiệp' })
  @IsNotEmpty()
  @IsString()
  invitationId: string;

  @ApiProperty({ description: 'Tên bàn (Bàn 1, Bàn VIP...)' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Số chỗ tối đa' })
  @IsNotEmpty()
  @IsNumber()
  maxSeats: number;

  @ApiProperty({ description: 'Số chỗ hiện tại', required: false })
  @IsOptional()
  @IsNumber()
  currentSeats?: number;

  @ApiProperty({ description: 'Mô tả', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Tọa độ X trên sơ đồ kéo thả (px)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  positionX?: number;

  @ApiProperty({
    description: 'Tọa độ Y trên sơ đồ kéo thả (px)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  positionY?: number;
}

export class UpdateTableDto extends PartialType(CreateTableDto) {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class FilterTableDto {
  @ApiProperty({ description: 'ID Thiệp', required: false })
  @IsOptional()
  @IsString()
  invitationId?: string;

  @ApiProperty({ description: 'Tên bàn (Bàn 1, Bàn VIP...)', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Số chỗ tối đa', required: false })
  @IsOptional()
  @IsNumber()
  maxSeats?: number;

  @ApiProperty({ description: 'Số chỗ hiện tại', required: false })
  @IsOptional()
  @IsNumber()
  currentSeats?: number;

  @ApiProperty({ description: 'Mô tả', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Tọa độ X trên sơ đồ kéo thả (px)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  positionX?: number;

  @ApiProperty({
    description: 'Tọa độ Y trên sơ đồ kéo thả (px)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  positionY?: number;
}

export class AssignGuestDto {
  @ApiProperty({ description: 'ID Bàn tiệc' })
  @IsUUID()
  @IsNotEmpty()
  tableId: string;

  @ApiProperty({ description: 'ID Khách mời' })
  @IsUUID()
  @IsNotEmpty()
  guestId: string;
}

export class UnassignGuestDto {
  @ApiProperty({ description: 'ID Khách mời' })
  @IsUUID()
  @IsNotEmpty()
  guestId: string;
}
