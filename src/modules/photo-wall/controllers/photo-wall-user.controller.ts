import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterPhotoWallDto } from '../dto';
import { PhotoWallService } from '../photo-wall.service';

@ApiTags('User - PhotoWall')
@Controller('photo-wall')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PhotoWallUserController {
  constructor(private readonly service: PhotoWallService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách' })
  async pagination(@Body() body: PaginationDto<FilterPhotoWallDto>) {
    return await this.service.pagination(body);
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

  @ApiOperation({ summary: 'Xóa ảnh' })
  @Post('delete')
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.delete(body, user);
  }
}
