import { enumData } from '@/common/constanst/enumData';
import { RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterNotificationDto } from '../dto';
import { NotificationService } from '../notification.service';

@ApiTags('Admin - Notification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
@Controller('notification')
export class NotificationAdminController {
  constructor(private readonly service: NotificationService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách thông báo toàn hệ thống' })
  async pagination(@Body() body: PaginationDto<FilterNotificationDto>) {
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết thông báo' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }
}
