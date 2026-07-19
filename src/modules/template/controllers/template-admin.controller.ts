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
@Controller('template')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles('ADMIN')
export class TemplateAdminController {
  constructor(private readonly service: TemplateService) {}

  @ApiOperation({ summary: 'Tạo mới' })
  @Post('create')
  async create(@Body() data: CreateTemplateDto, @CurrentUser() user: UserDto) {
    return await this.service.create(user, data);
  }

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách với bộ lọc' })
  async pagination(@Body() body: PaginationDto<FilterTemplateDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Cập nhật' })
  @Post('update')
  async update(@Body() data: UpdateTemplateDto, @CurrentUser() user: UserDto) {
    return await this.service.update(data, user);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }

  @ApiOperation({ summary: 'Thiết lập trạng thái trả phí (Premium) mẫu thiệp' })
  @Post('set-premium')
  async setPremium(
    @Body() body: SetPremiumTemplateDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.setPremium(body, user);
  }

  @ApiOperation({ summary: 'Thiết lập trạng thái hiển thị mẫu thiệp' })
  @Post('set-is-show')
  async setIsShow(
    @Body() body: SetIsShowTemplateDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.setIsShow(body, user);
  }

  @ApiOperation({ summary: 'Thiết lập trạng thái xóa mềm mẫu thiệp' })
  @Post('set-is-deleted')
  async setIsDeleted(
    @Body() body: SetIsDeletedTemplateDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.setIsDeleted(body, user);
  }
}
