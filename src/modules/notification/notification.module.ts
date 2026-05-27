import { NotificationRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([NotificationRepository])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
