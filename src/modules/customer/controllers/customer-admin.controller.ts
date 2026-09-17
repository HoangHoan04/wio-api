import { enumData } from '@/common/constanst/enumData';
import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerService } from '../customer.service';
import { ChangeCustomerPasswordDto, FilterCustomerDto } from '../dto';

@ApiTags('Admin - Customer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
@Controller('customer')
export class CustomerAdminController {
  constructor(private readonly service: CustomerService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Phân trang khách hàng' })
  async pagination(@Body() data: PaginationDto<FilterCustomerDto>) {
    return this.service.pagination(data);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết khách hàng theo ID' })
  async findById(@Body() data: IdDto) {
    return this.service.findById(data);
  }

  @Post('select-box')
  @ApiOperation({ summary: 'Danh sách khách hàng cho select box' })
  async selectBox() {
    return this.service.selectBox();
  }

  @Post('activate')
  @ApiOperation({ summary: 'Kích hoạt khách hàng' })
  async activate(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return this.service.activate(user, data);
  }

  @Post('deactivate')
  @ApiOperation({ summary: 'Ngưng hoạt động khách hàng' })
  async deactivate(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return this.service.deactivate(user, data);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Đổi mật khẩu khách hàng' })
  async changePassword(
    @CurrentUser() user: UserDto,
    @Body() data: ChangeCustomerPasswordDto,
  ) {
    return this.service.changePassword(user, data);
  }
}
