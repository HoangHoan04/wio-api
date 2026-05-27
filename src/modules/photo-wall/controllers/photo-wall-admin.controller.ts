import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreatePhotoWallDto,
  FilterPhotoWallDto,
  UpdatePhotoWallDto,
} from '../dto';
import { PhotoWallService } from '../photo-wall.service';

@ApiTags('Admin - PhotoWall')
@Controller('photo-wall')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles('ADMIN')
export class PhotoWallAdminController {
  constructor(private readonly service: PhotoWallService) {}

  @ApiOperation({ summary: 'Tạo mới' })
  @Post('create')
  async create(@Body() data: CreatePhotoWallDto, @CurrentUser() user: UserDto) {
    return await this.service.create(user, data);
  }

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách với bộ lọc' })
  async pagination(@Body() body: PaginationDto<FilterPhotoWallDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Cập nhật' })
  @Post('update')
  async update(@Body() data: UpdatePhotoWallDto, @CurrentUser() user: UserDto) {
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

  @ApiOperation({ summary: 'Duyệt ảnh' })
  @Post('approve')
  async approve(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.approve(body, user);
  }

  @ApiOperation({ summary: 'Từ chối duyệt ảnh' })
  @Post('reject')
  async reject(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.reject(body, user);
  }
}
