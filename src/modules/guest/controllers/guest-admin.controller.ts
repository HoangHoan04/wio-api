import { enumData } from '@/common/constanst/enumData';
import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterGuestDto } from '../dto';
import { GuestService } from '../guest.service';

@ApiTags('Admin - Guest')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
@Controller('guest')
export class GuestAdminController {
  constructor(private readonly service: GuestService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách khách mời toàn hệ thống' })
  async pagination(@Body() body: PaginationDto<FilterGuestDto>) {
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết khách mời' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }

  @Post('stats')
  @ApiOperation({ summary: 'Thống kê RSVP của đám cưới' })
  async stats(@Body() body: IdDto) {
    return this.service.getStats(body.id);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xoá mềm khách mời' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.delete(body, user);
  }
}
