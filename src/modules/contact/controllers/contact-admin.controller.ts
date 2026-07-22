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
@RequireRoles('ADMIN')
export class ContactAdminController {
  constructor(private readonly service: ContactService) {}

  @ApiOperation({ summary: 'Danh sách các yêu cầu liên hệ từ khách hàng' })
  @Post('pagination')
  async pagination(@Body() body: PaginationDto<FilterContactDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Chi tiết yêu cầu liên hệ' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }

  @ApiOperation({ summary: 'Cập nhật trạng thái / phản hồi liên hệ' })
  @Post('update-status')
  async updateStatus(
    @Body() body: UpdateContactStatusDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.updateStatus(body, user);
  }

  @ApiOperation({ summary: 'Xóa yêu cầu liên hệ' })
  @Post('delete')
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.delete(body, user);
  }
}
