import { ServicePlanRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { ActionLogModule } from '../action-log/action-log.module';
import { ServicePlanService } from './service-plan.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ServicePlanRepository]),
    ActionLogModule,
  ],
  providers: [ServicePlanService],
  exports: [ServicePlanService],
})
export class ServicePlanModule {}
