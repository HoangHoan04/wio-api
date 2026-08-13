import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvitationService } from '../invitation.service';

@ApiTags('Public - Invitation')
@Controller('invitation/public')
export class InvitationPublicController {
  constructor(private readonly service: InvitationService) {}

  @Get('find-by-slug/:slug')
  @ApiOperation({ summary: 'Lấy thiệp công khai theo slug' })
  async findBySlug(@Param('slug') slug: string) {
    return await this.service.findBySlug(slug);
  }
}
