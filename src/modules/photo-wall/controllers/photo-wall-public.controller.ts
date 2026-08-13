import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePhotoWallDto } from '../dto';
import { PhotoWallService } from '../photo-wall.service';

@ApiTags('Public - PhotoWall')
@Controller('photo-wall/public')
export class PhotoWallPublicController {
  constructor(private readonly service: PhotoWallService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Khách tải ảnh lên tường' })
  async upload(@Body() data: CreatePhotoWallDto) {
    return await this.service.createPublic(data);
  }
}
