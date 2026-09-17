import { ContactRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { ActionLogModule } from '../action-log/action-log.module';
import { ContactService } from './contact.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ContactRepository]),
    ActionLogModule,
  ],
  controllers: [],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
