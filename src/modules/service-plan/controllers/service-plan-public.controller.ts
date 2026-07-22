import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ServicePlanService } from '../service-plan.service';

@ApiTags('Public - ServicePlan')
@Controller('service-plan/public')
export class ServicePlanPublicController {
  constructor(private readonly service: ServicePlanService) {}

  @ApiOperation({ summary: 'Danh sách gói dịch vụ đang hoạt động' })
  @Post('list')
  async findActivePlans() {
    return await this.service.findActivePlans();
  }
}
