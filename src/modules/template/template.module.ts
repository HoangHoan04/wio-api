import { TemplateRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { ActionLogModule } from '../action-log/action-log.module';
import { TemplateService } from './template.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TemplateRepository]),
    ActionLogModule,
  ],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
