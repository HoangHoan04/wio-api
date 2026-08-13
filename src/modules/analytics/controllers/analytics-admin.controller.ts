import { enumData } from '@/common/constanst/enumData';
import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { UserDto } from '@/dto';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from '../analytics.service';

@ApiTags('Admin - Analytics')
@Controller('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
export class AnalyticsAdminController {
  constructor(private readonly service: AnalyticsService) {}

  @Post('overview')
  @ApiOperation({ summary: 'Tổng quan hệ thống' })
  async overview(@CurrentUser() _user: UserDto) {
    return await this.service.overview();
  }
}
