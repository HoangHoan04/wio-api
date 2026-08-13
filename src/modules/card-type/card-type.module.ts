import { CardTypeRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { CardTypeService } from './card-type.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CardTypeRepository])],
  providers: [CardTypeService],
  exports: [CardTypeService],
})
export class CardTypeModule {}
