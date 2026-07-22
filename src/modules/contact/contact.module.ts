import { ContactRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { ActionLogModule } from '../action-log/action-log.module';
import { ContactAdminController } from './controllers/contact-admin.controller';
import { ContactPublicController } from './controllers/contact-public.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ContactRepository]),
    ActionLogModule,
  ],
  controllers: [ContactPublicController, ContactAdminController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
