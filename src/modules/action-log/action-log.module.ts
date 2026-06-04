import { ActionLogRepository } from '@/repositories';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmExModule } from '../../typeorm';
import { ActionLogController } from './action-log.controller';
import { ActionLogService } from './action-log.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ActionLogRepository])],
  controllers: [ActionLogController],
  providers: [ActionLogService],
  exports: [ActionLogService],
})
export class ActionLogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
