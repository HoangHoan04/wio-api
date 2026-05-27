import { RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from '../analytics.service';

@ApiTags('Admin - Analytics')
@Controller('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles('ADMIN')
export class AnalyticsAdminController {
  constructor(private readonly service: AnalyticsService) {}

  @Post('system-stats')
  @ApiOperation({ summary: 'Lấy thống kê toàn hệ thống' })
  async getSystemStats() {
    return await this.service.getSystemStats();
  }
}
