import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateGuestDto } from './index';

export class IdentifyGuestDto {
  @ApiProperty({ description: 'Mã mờicá nhân' })
  @IsNotEmpty()
  @IsString()
  invitationCode: string;
}

export class RsvpGuestDto {
  @ApiProperty({ description: 'Mã mờicá nhân' })
  @IsNotEmpty()
  @IsString()
  invitationCode: string;

  @ApiProperty({ description: 'Trạng thái RSVP', required: false })
  @IsOptional()
  @IsString()
  rsvpStatus?: string;

  @ApiProperty({ description: 'Số ngườitham dự', required: false })
  @IsOptional()
  @IsNumber()
  attendingCount?: number;

  @ApiProperty({ description: 'Cần đưa đón', required: false })
  @IsOptional()
  @IsBoolean()
  needsTransport?: boolean;

  @ApiProperty({ description: 'Lờinhắn RSVP', required: false })
  @IsOptional()
  @IsString()
  rsvpNote?: string;
}

export class ImportGuestExcelDto {
  @ApiProperty({ description: 'ID thiệp' })
  @IsNotEmpty()
  @IsString()
  invitationId: string;
}

export class GenerateQrGuestDto {
  @ApiProperty({ description: 'ID khách mờ' })
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class CreateManyGuestsDto {
  @ApiProperty({ description: 'ID thiệp' })
  @IsNotEmpty()
  @IsString()
  invitationId: string;

  @ApiProperty({ description: 'Danh sách khách mờ', type: [CreateGuestDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGuestDto)
  guests: CreateGuestDto[];
}
