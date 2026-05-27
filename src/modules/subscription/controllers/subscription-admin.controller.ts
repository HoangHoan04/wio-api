import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AdminChangeSubscriptionPlanDto,
  CreateSubscriptionDto,
  FilterSubscriptionDto,
  UpdateSubscriptionDto,
} from '../dto';
import { SubscriptionService } from '../subscription.service';

@ApiTags('Admin - Subscription')
@Controller('subscription')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles('ADMIN')
export class SubscriptionAdminController {
  constructor(private readonly service: SubscriptionService) {}

  @ApiOperation({ summary: 'Tạo mới' })
  @Post('create')
  async create(
    @Body() data: CreateSubscriptionDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.create(user, data);
  }

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách với bộ lọc' })
  async pagination(@Body() body: PaginationDto<FilterSubscriptionDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Cập nhật' })
  @Post('update')
  async update(
    @Body() data: UpdateSubscriptionDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.update(data, user);
  }

  @ApiOperation({ summary: 'Xóa mềm' })
  @Post('delete')
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.delete(body, user);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }

  @ApiOperation({ summary: 'Thay đổi gói dịch vụ đăng ký' })
  @Post('change-plan')
  async changePlan(
    @Body() body: AdminChangeSubscriptionPlanDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.changePlan(body, user);
  }
}
