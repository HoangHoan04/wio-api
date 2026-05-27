import { Controller, Get, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';
import { GuestService } from '../../guest/guest.service';
import { RsvpStatus, DietaryPref } from '@/entities/enums';

export class PublicRsvpDto {
  @ApiProperty({ description: 'Mã mời khách mời' })
  @IsNotEmpty()
  @IsString()
  invitationCode: string;

  @ApiProperty({ description: 'Trạng thái RSVP', enum: RsvpStatus })
  @IsNotEmpty()
  @IsEnum(RsvpStatus)
  rsvpStatus: RsvpStatus;

  @ApiProperty({ description: 'Số người đi cùng', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  attendingCount?: number;

  @ApiProperty({ description: 'Chế độ ăn uống', enum: DietaryPref, required: false })
  @IsOptional()
  @IsEnum(DietaryPref)
  dietary?: DietaryPref;

  @ApiProperty({ description: 'Ghi chú chế độ ăn', required: false })
  @IsOptional()
  @IsString()
  dietaryNote?: string;

  @ApiProperty({ description: 'Có cần phương tiện đưa đón không', required: false })
  @IsOptional()
  @IsBoolean()
  needsTransport?: boolean;

  @ApiProperty({ description: 'Lời nhắn gửi cặp đôi', required: false })
  @IsOptional()
  @IsString()
  rsvpNote?: string;
}

@ApiTags('Public - Guest')
@Controller('guests')
export class PublicGuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post('rsvp')
  @ApiOperation({ summary: 'Khách gửi RSVP qua invitation_code' })
  async rsvp(@Body() dto: PublicRsvpDto) {
    return await this.guestService.rsvp(dto);
  }

  @Get('identify')
  @ApiOperation({ summary: 'Nhận diện khách qua URL param code' })
  async identify(@Query('code') code: string) {
    if (!code) throw new BadRequestException('Mã mời không được để trống');
    return await this.guestService.identify(code);
  }
}
