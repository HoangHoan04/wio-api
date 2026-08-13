import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicStockAssetListDto } from '../dto';
import { StockAssetService } from '../stock-asset.service';

@ApiTags('Public - Stock asset')
@Controller('stock-asset/public')
export class StockAssetPublicController {
  constructor(private readonly service: StockAssetService) {}

  @Get('list')
  @ApiOperation({ summary: 'Danh sách sticker/họa tiết/ảnh stock cho editor' })
  async list(@Query() query: PublicStockAssetListDto) {
    return await this.service.listPublic(query);
  }
}
