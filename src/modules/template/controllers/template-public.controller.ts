import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilterTemplateDto } from '../dto';
import { TemplateService } from '../template.service';

@ApiTags('Public - Template')
@Controller('template/public')
export class TemplatePublicController {
  constructor(private readonly service: TemplateService) {}

  @Get('list')
  @ApiOperation({ summary: 'Danh sách template công khai' })
  @ApiQuery({
    name: 'weddingTheme',
    required: false,
    enum: enumData.WEDDING_THEME,
  })
  async list(@Query('weddingTheme') weddingTheme?: string) {
    return this.service.listPublic(weddingTheme);
  }

  @Post('pagination')
  @ApiOperation({ summary: 'Phân trang template đang hiển thị (không cần đăng nhập)' })
  async pagination(@Body() body: PaginationDto<FilterTemplateDto>) {
    body.where = {
      ...(body.where || {}),
      isShow: true,
      isDeleted: false,
    };
    return this.service.pagination(body);
  }

  @Post('increment-view')
  @ApiOperation({ summary: 'Tăng lượt xem template' })
  async incrementView(@Body() body: IdDto) {
    return this.service.incrementView(body);
  }

  @Post('increment-preview')
  @ApiOperation({ summary: 'Tăng lượt xem trước template' })
  async incrementPreview(@Body() body: IdDto) {
    return this.service.incrementPreview(body);
  }
}
