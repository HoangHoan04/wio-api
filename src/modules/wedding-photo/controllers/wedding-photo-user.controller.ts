import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterWeddingPhotoDto } from '../dto';
import { WeddingPhotoService } from '../wedding-photo.service';

@ApiTags('User - WeddingPhoto')
@Controller('wedding-photo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class WeddingPhotoUserController {
  constructor(private readonly service: WeddingPhotoService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách' })
  async pagination(@Body() body: PaginationDto<FilterWeddingPhotoDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }
}
