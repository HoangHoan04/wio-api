import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ServicePlanService } from '../service-plan.service';

@ApiTags('Public - ServicePlan')
@Controller('service-plan/public')
export class ServicePlanPublicController {
  constructor(private readonly service: ServicePlanService) {}

  @Get('list')
  @ApiOperation({ summary: 'Danh sách gói dịch vụ đang hoạt động' })
  async findActivePlans() {
    return this.service.findActivePlans();
  }
}
