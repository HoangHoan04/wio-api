import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WeddingService } from '../../wedding/wedding.service';

@ApiTags('Public - Slug')
@Controller('slug')
export class PublicSlugController {
  constructor(private readonly weddingService: WeddingService) {}

  @Get('check/:slug')
  @ApiOperation({ summary: 'Kiểm tra slug có available không' })
  async check(@Param('slug') slug: string) {
    const available = await this.weddingService.checkSlugAvailable(slug);
    let suggestion: string | undefined = undefined;
    if (!available) {
      suggestion = await this.weddingService.generateSlugSuggestion(slug);
    }
    return { available, suggestion };
  }
}
