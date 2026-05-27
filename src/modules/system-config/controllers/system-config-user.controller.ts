import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { SystemConfigService } from '../system-config.service';
import { FilterSystemConfigDto } from '../dto';

@ApiTags('User - SystemConfig')
@Controller('system-config')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SystemConfigUserController {
  constructor(private readonly service: SystemConfigService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách' })
  async pagination(@Body() body: PaginationDto<FilterSystemConfigDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }
}
