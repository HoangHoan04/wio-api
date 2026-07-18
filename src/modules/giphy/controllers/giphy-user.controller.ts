import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GiphyService } from '../giphy.service';
import { PexelsService } from '../pexels.service';

@ApiTags('User - Giphy')
@Controller('giphy')
export class GiphyUserController {
  constructor(
    private readonly giphyService: GiphyService,
    private readonly pexelsService: PexelsService,
  ) {}

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm sticker trên GIPHY' })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async search(
    @Query('q') q?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    if (q) {
      return this.giphyService.search(
        q,
        Number(limit) || 25,
        Number(offset) || 0,
      );
    }
    return this.giphyService.trending(Number(limit) || 25, Number(offset) || 0);
  }

  @Get('pexels-search')
  @ApiOperation({ summary: 'Tìm kiếm ảnh trên Pexels' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'page', required: false })
  async pexelsSearch(
    @Query('q') q: string,
    @Query('perPage') perPage?: string,
    @Query('page') page?: string,
  ) {
    if (q) {
      return this.pexelsService.search(
        q,
        Number(perPage) || 20,
        Number(page) || 1,
      );
    }
    return this.pexelsService.curated(Number(perPage) || 20, Number(page) || 1);
  }
}
