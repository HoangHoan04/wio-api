import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WeddingService } from '../wedding.service';

@ApiTags('Public - Wedding')
@Controller('wedding/public')
export class WeddingPublicController {
  constructor(private readonly service: WeddingService) {}

  @ApiOperation({ summary: 'Lấy thông tin thiệp cưới bằng slug' })
  @Get('find-by-slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.service.findBySlug(slug);
  }
}
