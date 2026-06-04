import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MusicBackgroundService } from '../music-background.service';
import { ImportYoutubeDto } from '../dto';
import { IdDto } from '@/dto';

@ApiTags('User - Music Background')
@Controller('music-background')
export class MusicBackgroundUserController {
  constructor(private readonly musicService: MusicBackgroundService) {}

  @Post('active')
  @ApiOperation({ summary: 'Lấy danh sách nhạc nền hoạt động' })
  findAllActive(@Body() query: any) {
    return this.musicService.paginationActive(query);
  }

  @Post('import-youtube')
  @ApiOperation({ summary: 'Khách hàng nhập nhạc từ YouTube' })
  importYoutube(@Body() importDto: ImportYoutubeDto) {
    return this.musicService.importYoutube(importDto);
  }

  @Post('increment-usage')
  @ApiOperation({ summary: 'Tăng lượt dùng bài hát' })
  incrementUsage(@Body() data: IdDto) {
    return this.musicService.incrementUsage(data);
  }
}
