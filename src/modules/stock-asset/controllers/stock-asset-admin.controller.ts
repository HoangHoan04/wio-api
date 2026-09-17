import { enumData } from '@/common/constanst/enumData';
import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateStockAssetDto,
  FilterStockAssetDto,
  UpdateStockAssetDto,
} from '../dto';
import { StockAssetService } from '../stock-asset.service';

@ApiTags('Admin - StockAsset')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
@Controller('stock-asset')
export class StockAssetAdminController {
  constructor(private readonly service: StockAssetService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách stock asset (phân trang)' })
  async pagination(@Body() body: PaginationDto<FilterStockAssetDto>) {
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết stock asset' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }

  @Post('create')
  @ApiOperation({ summary: 'Tạo stock asset' })
  async create(
    @Body() body: CreateStockAssetDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.create(user, body);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật stock asset' })
  async update(
    @Body() body: UpdateStockAssetDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.update(body, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xoá mềm stock asset' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.delete(body, user);
  }
}
