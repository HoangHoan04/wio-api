import { enumData } from '@/common/constanst/enumData';
import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContactService } from '../contact.service';
import { FilterContactDto, UpdateContactStatusDto } from '../dto';

@ApiTags('Admin - Contact')
@Controller('contact')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
export class ContactAdminController {
  constructor(private readonly service: ContactService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách các yêu cầu liên hệ' })
  async pagination(@Body() body: PaginationDto<FilterContactDto>) {
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết yêu cầu liên hệ' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }

  @Post('update-status')
  @ApiOperation({ summary: 'Cập nhật trạng thái / phản hồi liên hệ' })
  async updateStatus(
    @Body() body: UpdateContactStatusDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.updateStatus(body, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xóa yêu cầu liên hệ' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.delete(body, user);
  }
}
