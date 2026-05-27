import { CurrentUser, RequireRoles } from '@/common/decorators';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateWishDto, FilterWishDto, UpdateWishDto } from '../dto';
import { WishService } from '../wish.service';

@ApiTags('Admin - Wish')
@Controller('wish')
@ApiBearerAuth()
@RequireRoles('ADMIN')
export class WishAdminController {
  constructor(private readonly service: WishService) {}

  @ApiOperation({ summary: 'Tạo mới' })
  @Post('create')
  async create(@Body() data: CreateWishDto, @CurrentUser() user: UserDto) {
    return await this.service.create(user, data);
  }

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách với bộ lọc' })
  async pagination(@Body() body: PaginationDto<FilterWishDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Cập nhật' })
  @Post('update')
  async update(@Body() data: UpdateWishDto, @CurrentUser() user: UserDto) {
    return await this.service.update(data, user);
  }

  @ApiOperation({ summary: 'Xóa mềm' })
  @Post('delete')
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.delete(body, user);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }

  @ApiOperation({ summary: 'Duyệt lời chúc' })
  @Post('approve')
  async approve(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.approve(body, user);
  }

  @ApiOperation({ summary: 'Từ chối duyệt lời chúc' })
  @Post('reject')
  async reject(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.reject(body, user);
  }

  @ApiOperation({ summary: 'Ghim lời chúc' })
  @Post('pin')
  async pin(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.pin(body, user);
  }

  @ApiOperation({ summary: 'Bỏ ghim lời chúc' })
  @Post('unpin')
  async unpin(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.unpin(body, user);
  }
}
