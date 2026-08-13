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

@ApiTags('Admin - Stock asset')
@Controller('stock-asset')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles('ADMIN')
export class StockAssetAdminController {
  constructor(private readonly service: StockAssetService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách stock asset' })
  async pagination(@Body() body: PaginationDto<FilterStockAssetDto>) {
    return await this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết stock asset' })
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }

  @Post('create')
  @ApiOperation({ summary: 'Tạo stock asset' })
  async create(
    @Body() body: CreateStockAssetDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.create(user, body);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật stock asset' })
  async update(
    @Body() body: UpdateStockAssetDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.update(body, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xóa stock asset' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.delete(body, user);
  }
}
