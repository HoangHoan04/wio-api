import { TemplateCategoryRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { TemplateCategoryService } from './template-category.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([TemplateCategoryRepository])],
  providers: [TemplateCategoryService],
  exports: [TemplateCategoryService],
})
export class TemplateCategoryModule {}
