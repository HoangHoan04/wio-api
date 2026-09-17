import { enumData } from '@/common/constanst/enumData';
import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateTemplateDto,
  FilterTemplateDto,
  SetIsDeletedTemplateDto,
  SetIsShowTemplateDto,
  SetPremiumTemplateDto,
  UpdateTemplateDto,
} from '../dto';
import { TemplateService } from '../template.service';

@ApiTags('Admin - Template')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
@Controller('template')
export class TemplateAdminController {
  constructor(private readonly service: TemplateService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách template (phân trang)' })
  async pagination(@Body() body: PaginationDto<FilterTemplateDto>) {
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết template' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }

  @Post('create')
  @ApiOperation({ summary: 'Tạo template mới' })
  async create(@Body() data: CreateTemplateDto, @CurrentUser() user: UserDto) {
    return this.service.create(user, data);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật template' })
  async update(@Body() data: UpdateTemplateDto, @CurrentUser() user: UserDto) {
    return this.service.update(data, user);
  }

  @Post('set-premium')
  @ApiOperation({ summary: 'Đặt trạng thái premium' })
  async setPremium(
    @Body() body: SetPremiumTemplateDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.setPremium(body, user);
  }

  @Post('set-is-show')
  @ApiOperation({ summary: 'Đặt trạng thái hiển thị' })
  async setIsShow(
    @Body() body: SetIsShowTemplateDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.setIsShow(body, user);
  }

  @Post('set-is-deleted')
  @ApiOperation({ summary: 'Đặt trạng thái xoá mềm' })
  async setIsDeleted(
    @Body() body: SetIsDeletedTemplateDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.setIsDeleted(body, user);
  }
}
