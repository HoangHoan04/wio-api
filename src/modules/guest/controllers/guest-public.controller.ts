import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdentifyGuestDto, RsvpGuestDto } from '../dto';
import { GuestService } from '../guest.service';

@ApiTags('Public - Guest')
@Controller('guest')
export class GuestPublicController {
  constructor(private readonly service: GuestService) {}

  @Post('identify')
  @ApiOperation({ summary: 'Nhận diện khách mời bằng mã mời' })
  async identify(@Body() dto: IdentifyGuestDto) {
    return this.service.identify(dto);
  }

  @Post('rsvp')
  @ApiOperation({ summary: 'Gửi phản hồi RSVP' })
  async rsvp(@Body() dto: RsvpGuestDto) {
    return this.service.rsvp(dto);
  }
}
