import { TypeOrmExModule } from '@/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { VisitorService } from './visitor.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([]), CacheModule.register()],
  controllers: [],
  providers: [VisitorService],
  exports: [VisitorService],
})
export class VisitorModule {}
