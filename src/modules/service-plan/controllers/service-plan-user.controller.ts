import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { ServicePlanService } from '../service-plan.service';
import { FilterServicePlanDto } from '../dto';

@ApiTags('User - ServicePlan')
@Controller('service-plan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ServicePlanUserController {
  constructor(private readonly service: ServicePlanService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách' })
  async pagination(@Body() body: PaginationDto<FilterServicePlanDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }
}
