import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminForceResetSlugDto, FilterWeddingDto } from '../dto';
import { WeddingService } from '../wedding.service';

@ApiTags('Admin - Wedding')
@Controller('wedding')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles('ADMIN')
export class WeddingAdminController {
  constructor(private readonly service: WeddingService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách đám cưới toàn hệ thống (có bộ lọc)' })
  async pagination(@Body() body: PaginationDto<FilterWeddingDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Chi tiết đám cưới' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }

  @ApiOperation({
    summary: 'Admin force-reset slug (trường hợp vi phạm / hỗ trợ kỹ thuật)',
  })
  @Post('force-reset-slug')
  async forceResetSlug(
    @Body() dto: AdminForceResetSlugDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.adminForceResetSlug(dto, user);
  }

  @ApiOperation({ summary: 'Xem lịch sử thay đổi slug của đám cưới (audit)' })
  @Post('slug-history')
  async slugHistory(@Body() body: IdDto) {
    return await this.service.getSlugHistory(body.id);
  }

  @ApiOperation({ summary: 'Publish đám cưới (Admin)' })
  @Post('publish')
  async publish(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.publish(body.id, user);
  }

  @ApiOperation({ summary: 'Unpublish / archive đám cưới (Admin)' })
  @Post('unpublish')
  async unpublish(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.unpublish(body.id, user);
  }

  @ApiOperation({ summary: 'Thống kê RSVP của một đám cưới (Admin view)' })
  @Post('stats')
  async stats(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.getStats(body.id, user);
  }
}
