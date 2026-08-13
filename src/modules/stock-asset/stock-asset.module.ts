import { StockAssetRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { StockAssetService } from './stock-asset.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([StockAssetRepository])],
  providers: [StockAssetService],
  exports: [StockAssetService],
})
export class StockAssetModule {}
