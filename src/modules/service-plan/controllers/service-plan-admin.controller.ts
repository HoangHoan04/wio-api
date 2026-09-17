import { enumData } from '@/common/constanst/enumData';
import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateServicePlanDto,
  FilterServicePlanDto,
  UpdateServicePlanDto,
} from '../dto';
import { ServicePlanService } from '../service-plan.service';

@ApiTags('Admin - ServicePlan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
@Controller('service-plan')
export class ServicePlanAdminController {
  constructor(private readonly service: ServicePlanService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách gói dịch vụ (có phân trang)' })
  async pagination(@Body() body: PaginationDto<FilterServicePlanDto>) {
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết gói dịch vụ' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }

  @Post('create')
  @ApiOperation({ summary: 'Tạo gói dịch vụ mới' })
  async create(
    @Body() data: CreateServicePlanDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.create(user, data);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật gói dịch vụ' })
  async update(
    @Body() data: UpdateServicePlanDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.update(data, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xoá gói dịch vụ' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.delete(body, user);
  }

  @Post('select-box')
  @ApiOperation({ summary: 'Danh sách gói dịch vụ cho select box' })
  async selectBox() {
    return this.service.selectBox();
  }
}
