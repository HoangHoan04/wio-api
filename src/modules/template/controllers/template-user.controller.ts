import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterTemplateDto } from '../dto';
import { TemplateService } from '../template.service';

@ApiTags('User - Template')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('template')
export class TemplateUserController {
  constructor(private readonly service: TemplateService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách template đang hiển thị' })
  async pagination(@Body() body: PaginationDto<FilterTemplateDto>) {
    body.where = {
      ...(body.where || {}),
      isShow: true,
      isDeleted: false,
    };
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết template' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }

  @Post('increment-view')
  @ApiOperation({ summary: 'Tăng lượt dùng template' })
  async incrementView(@Body() body: IdDto) {
    return this.service.incrementView(body);
  }

  @Post('increment-preview')
  @ApiOperation({ summary: 'Tăng lượt xem trước template' })
  async incrementPreview(@Body() body: IdDto) {
    return this.service.incrementPreview(body);
  }
}
