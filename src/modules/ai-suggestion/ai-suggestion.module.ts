import { AiSuggestionRepository } from '@/repositories';
import { TypeOrmExModule } from '@/typeorm';
import { Module } from '@nestjs/common';
import { AiSuggestionService } from './ai-suggestion.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([AiSuggestionRepository])],
  providers: [AiSuggestionService],
  exports: [AiSuggestionService],
})
export class AiSuggestionModule {}
