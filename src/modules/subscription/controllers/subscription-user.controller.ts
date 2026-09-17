import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterSubscriptionDto } from '../dto';
import { SubscriptionService } from '../subscription.service';

@ApiTags('User - Subscription')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscription')
export class SubscriptionUserController {
  constructor(private readonly service: SubscriptionService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách đăng ký gói của tôi' })
  async pagination(
    @Body() body: PaginationDto<FilterSubscriptionDto>,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.paginationForUser(body, user);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết đăng ký gói' })
  async findById(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.findById(body, user);
  }

  @Post('active')
  @ApiOperation({ summary: 'Gói dịch vụ đang hoạt động của tôi' })
  async getActive(@CurrentUser() user: UserDto) {
    const sub = await this.service.getActiveByUser(user.id);
    return { message: 'Thành công', data: sub };
  }
}
