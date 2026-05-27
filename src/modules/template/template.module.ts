import { TemplateRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([TemplateRepository])],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
