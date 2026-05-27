import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterTemplateDto } from '../dto';
import { TemplateService } from '../template.service';

@ApiTags('User - Template')
@Controller('template')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TemplateUserController {
  constructor(private readonly service: TemplateService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách' })
  async pagination(@Body() body: PaginationDto<FilterTemplateDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }
}
