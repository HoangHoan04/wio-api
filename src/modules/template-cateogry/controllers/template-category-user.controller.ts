import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TemplateCategoryService } from '../template-category.service';

@ApiTags('Public - TemplateCategory')
@Controller('template-category/public')
export class TemplateCategoryPublicController {
  constructor(private readonly service: TemplateCategoryService) {}

  @Get('list')
  @ApiOperation({ summary: 'Danh sách phong cách cưới' })
  async list() {
    return this.service.listActive();
  }
}
