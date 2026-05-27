import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterWishDto } from '../dto';
import { WishService } from '../wish.service';

@ApiTags('User - Wish')
@Controller('wish')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class WishUserController {
  constructor(private readonly service: WishService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách' })
  async pagination(@Body() body: PaginationDto<FilterWishDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }
}
