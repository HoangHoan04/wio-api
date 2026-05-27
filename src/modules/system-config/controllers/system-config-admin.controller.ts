import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateSystemConfigDto,
  FilterSystemConfigDto,
  UpdateSystemConfigDto,
} from '../dto';
import { SystemConfigService } from '../system-config.service';

@ApiTags('Admin - SystemConfig')
@Controller('system-config')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles('ADMIN')
export class SystemConfigAdminController {
  constructor(private readonly service: SystemConfigService) {}

  @ApiOperation({ summary: 'Tạo mới' })
  @Post('create')
  async create(
    @Body() data: CreateSystemConfigDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.create(user, data);
  }

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách với bộ lọc' })
  async pagination(@Body() body: PaginationDto<FilterSystemConfigDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Cập nhật' })
  @Post('update')
  async update(
    @Body() data: UpdateSystemConfigDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.update(data, user);
  }

  @ApiOperation({ summary: 'Xóa mềm' })
  @Post('delete')
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.delete(body, user);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }
}
