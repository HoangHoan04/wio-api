import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterGuestDto } from '../dto';
import { GuestService } from '../guest.service';

@ApiTags('Admin - Guest')
@Controller('guest')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles('ADMIN')
export class GuestAdminController {
  constructor(private readonly service: GuestService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách khách mời toàn hệ thống' })
  async pagination(@Body() body: PaginationDto<FilterGuestDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Chi tiết khách mời' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }

  @ApiOperation({ summary: 'Thống kê RSVP của đám cưới' })
  @Post('stats')
  async stats(@Body() body: IdDto) {
    return await this.service.getStats(body.id);
  }

  @ApiOperation({ summary: 'Xóa mềm khách mời' })
  @Post('delete')
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.delete(body, user);
  }
}
