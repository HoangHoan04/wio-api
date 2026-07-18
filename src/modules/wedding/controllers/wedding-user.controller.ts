import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateWeddingDto, FilterWeddingDto, UpdateWeddingDto } from '../dto';
import { WeddingService } from '../wedding.service';

@ApiTags('User - Wedding')
@Controller('wedding')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class WeddingUserController {
  constructor(private readonly service: WeddingService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách' })
  async pagination(@Body() body: PaginationDto<FilterWeddingDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }

  @ApiOperation({ summary: 'Tạo đám cưới mới' })
  @Post('create')
  async create(@Body() data: CreateWeddingDto, @CurrentUser() user: UserDto) {
    data.userId = user.id;
    return await this.service.create(user, data);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin đám cưới' })
  @Post('update')
  async update(@Body() data: UpdateWeddingDto, @CurrentUser() user: UserDto) {
    return await this.service.update(data, user);
  }

  @ApiOperation({ summary: 'Xuất bản đám cưới' })
  @Post('publish')
  async publish(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.publish(body.id, user);
  }

  @ApiOperation({ summary: 'Hủy xuất bản đám cưới (về Nháp)' })
  @Post('unpublish')
  async unpublish(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.unpublish(body.id, user);
  }
}
