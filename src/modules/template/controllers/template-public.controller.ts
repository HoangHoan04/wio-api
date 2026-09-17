import { enumData } from '@/common/constanst/enumData';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
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
}
