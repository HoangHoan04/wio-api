import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
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
}
