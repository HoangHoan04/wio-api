import { enumData } from '@/common/constanst/enumData';
import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateWishDto, FilterWishDto, UpdateWishDto } from '../dto';
import { WishService } from '../wish.service';

@ApiTags('Admin - Wish')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
@Controller('wish')
export class WishAdminController {
  constructor(private readonly service: WishService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách lời chúc toàn hệ thống' })
  async pagination(@Body() body: PaginationDto<FilterWishDto>) {
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết lời chúc' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }

  @Post('create')
  @ApiOperation({ summary: 'Admin tạo lời chúc' })
  async create(@Body() data: CreateWishDto, @CurrentUser() user: UserDto) {
    return this.service.create(user, data);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật lời chúc' })
  async update(@Body() data: UpdateWishDto, @CurrentUser() user: UserDto) {
    return this.service.update(data, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xoá mềm lời chúc' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.delete(body, user);
  }

  @Post('approve')
  @ApiOperation({ summary: 'Duyệt lời chúc' })
  async approve(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.approve(body, user);
  }

  @Post('reject')
  @ApiOperation({ summary: 'Từ chối lời chúc' })
  async reject(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.reject(body, user);
  }

  @Post('pin')
  @ApiOperation({ summary: 'Ghim lời chúc' })
  async pin(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.pin(body, user);
  }

  @Post('unpin')
  @ApiOperation({ summary: 'Bỏ ghim lời chúc' })
  async unpin(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.unpin(body, user);
  }
}
