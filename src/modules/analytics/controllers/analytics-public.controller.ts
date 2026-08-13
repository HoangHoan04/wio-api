import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from '../analytics.service';

@ApiTags('Public - Analytics')
@Controller('analytics/public')
export class AnalyticsPublicController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Số liệu tổng quan cho trang chủ' })
  async overview() {
    return await this.service.publicOverview();
  }
}
