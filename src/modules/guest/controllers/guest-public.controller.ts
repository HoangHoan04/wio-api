import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdentifyGuestDto, RsvpGuestDto } from '../dto';
import { GuestService } from '../guest.service';

@ApiTags('Public - Guest')
@Controller('guest/public')
export class GuestPublicController {
  constructor(private readonly service: GuestService) {}

  @ApiOperation({ summary: 'Nhận diện khách mời bằng mã mời' })
  @Post('identify')
  async identify(@Body() dto: IdentifyGuestDto) {
    return await this.service.identify(dto);
  }

  @ApiOperation({ summary: 'Gửi phản hồi RSVP' })
  @Post('rsvp')
  async rsvp(@Body() dto: RsvpGuestDto) {
    return await this.service.rsvp(dto);
  }
}
