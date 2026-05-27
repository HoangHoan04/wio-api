import { GuestGroupRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { GuestGroupService } from './guest-group.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([GuestGroupRepository])],
  providers: [GuestGroupService],
  exports: [GuestGroupService],
})
export class GuestGroupModule {}
