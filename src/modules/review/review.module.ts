import { ReviewRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ReviewRepository])],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
