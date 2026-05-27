import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterSubscriptionDto } from '../dto';
import { SubscriptionService } from '../subscription.service';

@ApiTags('User - Subscription')
@Controller('subscription')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SubscriptionUserController {
  constructor(private readonly service: SubscriptionService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách' })
  async pagination(@Body() body: PaginationDto<FilterSubscriptionDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }
}
