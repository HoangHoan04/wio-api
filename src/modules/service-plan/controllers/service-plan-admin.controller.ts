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
@Controller('service-plan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles('ADMIN')
export class ServicePlanAdminController {
  constructor(private readonly service: ServicePlanService) {}

  @ApiOperation({ summary: 'Tạo mới gói dịch vụ' })
  @Post('create')
  async create(
    @Body() data: CreateServicePlanDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.create(user, data);
  }

  @ApiOperation({ summary: 'Lấy danh sách gói dịch vụ với bộ lọc' })
  @Post('pagination')
  async pagination(@Body() body: PaginationDto<FilterServicePlanDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Cập nhật gói dịch vụ' })
  @Post('update')
  async update(
    @Body() data: UpdateServicePlanDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.update(data, user);
  }

  @ApiOperation({ summary: 'Chi tiết gói dịch vụ' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }

  @ApiOperation({ summary: 'Xóa gói dịch vụ' })
  @Post('delete')
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.delete(body, user);
  }

  @ApiOperation({ summary: 'Lấy danh sách gói dịch vụ cho select box' })
  @Post('select-box')
  async selectBox() {
    return await this.service.selectBox();
  }
}
