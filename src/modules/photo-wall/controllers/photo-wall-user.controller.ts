import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterPhotoWallDto } from '../dto';
import { PhotoWallService } from '../photo-wall.service';

@ApiTags('User - PhotoWall')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('photo-wall')
export class PhotoWallUserController {
  constructor(private readonly service: PhotoWallService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách ảnh của tôi' })
  async pagination(
    @Body() body: PaginationDto<FilterPhotoWallDto>,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.paginationForUser(body, user);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết ảnh' })
  async findById(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.findById(body, user);
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

  @Post('delete')
  @ApiOperation({ summary: 'Xoá ảnh' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.delete(body, user);
  }
}
