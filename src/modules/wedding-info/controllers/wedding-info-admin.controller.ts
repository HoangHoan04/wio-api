import { enumData } from '@/common/constanst/enumData';
import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateWeddingInfoDto,
  FilterWeddingInfoDto,
  UpdateWeddingInfoDto,
} from '../dto';
import { WeddingInfoService } from '../wedding-info.service';

@ApiTags('Admin - WeddingInfo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
@Controller('wedding-info')
export class WeddingInfoAdminController {
  constructor(private readonly service: WeddingInfoService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách thông tin cặp đôi toàn hệ thống' })
  async pagination(@Body() body: PaginationDto<FilterWeddingInfoDto>) {
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết thông tin cặp đôi' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }

  @Post('create')
  @ApiOperation({ summary: 'Admin tạo thông tin cặp đôi' })
  async create(
    @Body() dto: CreateWeddingInfoDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.create(user, dto);
  }

  @Post('update')
  @ApiOperation({ summary: 'Admin cập nhật thông tin cặp đôi' })
  async update(
    @Body() dto: UpdateWeddingInfoDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.update(dto, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xoá mềm thông tin cặp đôi' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.delete(body, user);
  }
}
