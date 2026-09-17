import { enumData } from '@/common/constanst/enumData';
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
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
@Controller('subscription')
export class SubscriptionAdminController {
  constructor(private readonly service: SubscriptionService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách đăng ký gói (phân trang)' })
  async pagination(@Body() body: PaginationDto<FilterSubscriptionDto>) {
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết đăng ký gói' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }

  @Post('create')
  @ApiOperation({ summary: 'Admin tạo đăng ký gói cho user' })
  async create(
    @Body() data: CreateSubscriptionDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.create(user, data);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật đăng ký gói' })
  async update(
    @Body() data: UpdateSubscriptionDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.update(data, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xoá mềm đăng ký gói' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.delete(body, user);
  }

  @Post('change-plan')
  @ApiOperation({ summary: 'Đổi gói dịch vụ đăng ký' })
  async changePlan(
    @Body() body: AdminChangeSubscriptionPlanDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.changePlan(body, user);
  }
}
