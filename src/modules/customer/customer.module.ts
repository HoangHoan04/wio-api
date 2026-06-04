import { CustomerRepository, UserRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { ActionLogModule } from '../action-log/action-log.module';
import { CustomerService } from './customer.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([CustomerRepository, UserRepository]),
    ActionLogModule,
  ],
  controllers: [],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
