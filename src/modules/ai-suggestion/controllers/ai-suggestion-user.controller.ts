import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiSuggestionService } from '../ai-suggestion.service';
import { FilterAiSuggestionDto } from '../dto';

@ApiTags('User - AiSuggestion')
@Controller('ai-suggestion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AiSuggestionUserController {
  constructor(private readonly service: AiSuggestionService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách' })
  async pagination(@Body() body: PaginationDto<FilterAiSuggestionDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }
}
