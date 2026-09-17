import { enumData } from '@/common/constanst/enumData';
import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminForceResetSlugDto, FilterInvitationDto } from '../dto';
import { InvitationService } from '../invitation.service';

@ApiTags('Admin - Invitation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
@Controller('invitation')
export class InvitationAdminController {
  constructor(private readonly service: InvitationService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách thiệp toàn hệ thống' })
  async pagination(@Body() body: PaginationDto<FilterInvitationDto>) {
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết thiệp' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xóa thiệp' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.delete(body, user);
  }

  @Post('publish')
  @ApiOperation({ summary: 'Xuất bản thiệp' })
  async publish(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.publish(body.id, user);
  }

  @Post('unpublish')
  @ApiOperation({ summary: 'Hủy xuất bản' })
  async unpublish(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.unpublish(body.id, user);
  }

  @Post('force-reset-slug')
  @ApiOperation({ summary: 'Admin force-reset slug' })
  async forceResetSlug(
    @Body() dto: AdminForceResetSlugDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.adminForceResetSlug(dto, user);
  }

  @Post('slug-history')
  @ApiOperation({ summary: 'Lịch sử slug' })
  async slugHistory(@Body() body: IdDto) {
    return this.service.getSlugHistory(body.id);
  }

  @Post('stats')
  @ApiOperation({ summary: 'Thống kê RSVP' })
  async stats(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.getStats(body.id, user);
  }
}
