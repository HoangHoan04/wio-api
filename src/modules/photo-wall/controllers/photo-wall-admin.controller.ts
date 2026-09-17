import { enumData } from '@/common/constanst/enumData';
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
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
@Controller('photo-wall')
export class PhotoWallAdminController {
  constructor(private readonly service: PhotoWallService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách ảnh toàn hệ thống' })
  async pagination(@Body() body: PaginationDto<FilterPhotoWallDto>) {
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết ảnh' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }

  @Post('create')
  @ApiOperation({ summary: 'Admin tạo ảnh' })
  async create(@Body() data: CreatePhotoWallDto, @CurrentUser() user: UserDto) {
    return this.service.create(user, data);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật ảnh' })
  async update(@Body() data: UpdatePhotoWallDto, @CurrentUser() user: UserDto) {
    return this.service.update(data, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xoá mềm ảnh' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.delete(body, user);
  }

  @Post('approve')
  @ApiOperation({ summary: 'Duyệt ảnh' })
  async approve(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.approve(body, user);
  }

  @Post('reject')
  @ApiOperation({ summary: 'Từ chối duyệt ảnh' })
  async reject(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.reject(body, user);
  }
}
