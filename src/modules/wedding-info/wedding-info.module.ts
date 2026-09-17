import { InvitationRepository, WeddingInfoRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { WeddingInfoService } from './wedding-info.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      WeddingInfoRepository,
      InvitationRepository,
    ]),
  ],
  controllers: [],
  providers: [WeddingInfoService],
  exports: [WeddingInfoService],
})
export class WeddingInfoModule {}
