import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicCreateWishDto, PublicWishListDto } from '../dto';
import { WishService } from '../wish.service';

@ApiTags('Public - Wish')
@Controller('wish/public')
export class WishPublicController {
  constructor(private readonly service: WishService) {}

  @Post('create')
  @ApiOperation({ summary: 'Khách gửi lời chúc' })
  async create(@Body() data: PublicCreateWishDto) {
    return this.service.createPublic(data);
  }

  @Get('list')
  @ApiOperation({ summary: 'Danh sách lời chúc đã duyệt' })
  async list(@Query() query: PublicWishListDto) {
    return this.service.listPublic(query);
  }
}
