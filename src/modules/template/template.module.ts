import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { TemplateCardTypeRepository, TemplateRepository } from '@/repositories';
import { ActionLogModule } from '../action-log/action-log.module';
import { TemplateService } from './template.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TemplateRepository, TemplateCardTypeRepository]),
    ActionLogModule,
  ],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
