import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WeddingInfoService } from '../wedding-info.service';

@ApiTags('Public - WeddingInfo')
@Controller('wedding-info/public')
export class WeddingInfoPublicController {
  constructor(private readonly service: WeddingInfoService) {}

  @Get('by-invitation/:invitationId')
  @ApiOperation({ summary: 'Lấy thông tin cặp đôi của thiệp công khai' })
  async getByInvitation(@Param('invitationId') invitationId: string) {
    return this.service.getPublicByInvitation(invitationId);
  }
}
