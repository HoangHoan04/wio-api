import { IdDto } from '@/dto';
import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImportYoutubeDto } from '../dto';
import { MusicBackgroundService } from '../music-background.service';
import { YoutubeAudioProviderType } from '../../youtube-audio';

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

  @Post('info')
  @ApiOperation({ summary: 'Lấy metadata YouTube (không tải)' })
  getYoutubeInfo(
    @Body('url') url: string,
    @Body('provider') provider?: YoutubeAudioProviderType,
  ) {
    return this.musicService.getYoutubeInfo(url, provider);
  }

  @Post('increment-usage')
  @ApiOperation({ summary: 'Tăng lượt dùng bài hát' })
  incrementUsage(@Body() data: IdDto) {
    return this.musicService.incrementUsage(data);
  }
}
