import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { ServicePlanRepository } from '@/repositories';
import { ServicePlanService } from './service-plan.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ServicePlanRepository])],
  providers: [ServicePlanService],
  exports: [ServicePlanService],
})
export class ServicePlanModule {}
