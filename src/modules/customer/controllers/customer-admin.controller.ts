import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerService } from '../customer.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Customer')
@Controller('Customer')
export class CustomerAdminController {
  constructor(private readonly service: CustomerService) {}

  @ApiOperation({ summary: 'Hàm phân trang nhân viên' })
  @Post('pagination')
  async pagination(@CurrentUser() user: UserDto, @Body() data: PaginationDto) {
    return this.service.pagination(user, data);
  }

  @ApiOperation({ summary: 'Tìm kiếm chi tiết nhân viên theo ID' })
  @Post('find-by-id')
  async findById(@Body() data: IdDto) {
    return await this.service.findById(data.id);
  }

  @ApiOperation({ summary: 'Kích hoạt nhân viên' })
  @Post('activate')
  async activate(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.activate(user, data);
  }

  @ApiOperation({ summary: 'Ngưng hoạt động nhân viên' })
  @Post('deactivate')
  async deactivate(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.deactivate(user, data);
  }

  @ApiOperation({ summary: 'Lấy danh sách nhân viên cho select box' })
  @Post('select-box')
  async selectBox() {
    return await this.service.selectBox();
  }

  @ApiOperation({ summary: 'Đổi mật khẩu nhân viên' })
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: UserDto,
    @Body() data: { customerId: string; newPassword: string },
  ) {
    return await this.service.changePassword(user, data);
  }
}
