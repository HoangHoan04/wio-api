import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterWishDto } from '../dto';
import { WishService } from '../wish.service';

@ApiTags('User - Wish')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wish')
export class WishUserController {
  constructor(private readonly service: WishService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách lời chúc của tôi' })
  async pagination(
    @Body() body: PaginationDto<FilterWishDto>,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.paginationForUser(body, user);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết lời chúc' })
  async findById(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.findById(body, user);
  }

  @Post('approve')
  @ApiOperation({ summary: 'Duyệt lời chúc' })
  async approve(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.approve(body, user);
  }

  @Post('reject')
  @ApiOperation({ summary: 'Từ chối lời chúc' })
  async reject(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.reject(body, user);
  }

  @Post('pin')
  @ApiOperation({ summary: 'Ghim lời chúc' })
  async pin(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.pin(body, user);
  }

  @Post('unpin')
  @ApiOperation({ summary: 'Bỏ ghim lời chúc' })
  async unpin(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.unpin(body, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xoá mềm lời chúc' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.delete(body, user);
  }
}
