import { enumData } from '@/common/constanst/enumData';
import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TemplateCategoryService } from '../template-category.service';

@ApiTags('Admin - TemplateCategory')
@Controller('template-category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
export class TemplateCategoryAdminController {
  constructor(private readonly service: TemplateCategoryService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Phân trang phong cách cưới' })
  async pagination(@Body() body: PaginationDto) {
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết phong cách cưới' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }

  @Post('sync-enum')
  @ApiOperation({ summary: 'Đồng bộ phong cách cưới từ enum' })
  async syncEnum(@CurrentUser() user: UserDto) {
    return this.service.syncFromEnum(user);
  }
}
