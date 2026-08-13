import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateWishDto } from '../dto';
import { WishService } from '../wish.service';

@ApiTags('Public - Wish')
@Controller('wish/public')
export class WishPublicController {
  constructor(private readonly service: WishService) {}

  @Post('create')
  @ApiOperation({ summary: 'Khách gửi lời chúc' })
  async create(@Body() data: CreateWishDto) {
    return await this.service.createPublic(data);
  }
}
