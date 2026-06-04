import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterTemplateDto } from '../dto';
import { TemplateService } from '../template.service';

@ApiTags('User - Template')
@Controller('template')
export class TemplateUserController {
  constructor(private readonly service: TemplateService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách template' })
  async pagination(@Body() body: PaginationDto<FilterTemplateDto>) {
    // Ép buộc chỉ lấy các template đang hoạt động cho user/khách vãng lai
    if (!body.where) {
      body.where = {};
    }
    body.where.isShow = true;

    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }
}
