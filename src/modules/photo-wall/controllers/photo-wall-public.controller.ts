import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicUploadPhotoWallDto } from '../dto';
import { PhotoWallService } from '../photo-wall.service';

@ApiTags('Public - PhotoWall')
@Controller('photo-wall/public')
export class PhotoWallPublicController {
  constructor(private readonly service: PhotoWallService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Khách tải ảnh lên tường' })
  async upload(@Body() data: PublicUploadPhotoWallDto) {
    return this.service.createPublic(data);
  }

  @Get('list/:invitationId')
  @ApiOperation({ summary: 'Danh sách ảnh đã duyệt của thiệp' })
  async listApproved(@Param('invitationId') invitationId: string) {
    return this.service.listApprovedByInvitation(invitationId);
  }
}
