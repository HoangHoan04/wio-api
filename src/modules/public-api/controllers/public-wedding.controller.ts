import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WeddingService } from '../../wedding/wedding.service';
import { WishService } from '../../wish/wish.service';

@ApiTags('Public - Wedding')
@Controller('weddings')
export class PublicWeddingController {
  constructor(
    private readonly weddingService: WeddingService,
    private readonly wishService: WishService,
  ) {}

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy thông tin thiệp công khai' })
  async getBySlug(@Param('slug') slug: string) {
    const wedding = await this.weddingService.findBySlug(slug);
    if (wedding.status !== 'published') {
      throw new NotFoundException('Thiệp cưới chưa được công bố');
    }
    return { message: 'Thành công', data: wedding };
  }

  @Get(':slug/wishes')
  @ApiOperation({ summary: 'Lời chúc đã duyệt' })
  async getWishes(@Param('slug') slug: string) {
    const wedding = await this.weddingService.findBySlug(slug);
    const result = await this.wishService.pagination({
      skip: 0,
      take: 100,
      where: { weddingId: wedding.id, isApproved: true },
    });
    return { message: 'Thành công', data: result.data };
  }
}
