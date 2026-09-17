import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterServicePlanDto } from '../dto';
import { ServicePlanService } from '../service-plan.service';

@ApiTags('User - ServicePlan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('service-plan')
export class ServicePlanUserController {
  constructor(private readonly service: ServicePlanService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách gói dịch vụ' })
  async pagination(@Body() body: PaginationDto<FilterServicePlanDto>) {
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết gói dịch vụ' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }
}
