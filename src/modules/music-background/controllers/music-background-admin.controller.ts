import { RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { YoutubeAudioProviderType } from '../../youtube-audio';
import {
  CreateMusicBackgroundDto,
  ImportYoutubeDto,
  UpdateMusicBackgroundDto,
} from '../dto';
import { MusicBackgroundService } from '../music-background.service';

@ApiTags('Admin - Music Background')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles('ADMIN')
@Controller('music-background')
export class MusicBackgroundAdminController {
  constructor(private readonly musicService: MusicBackgroundService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách nhạc nền (có phân trang)' })
  pagination(@Body() query: any) {
    return this.musicService.pagination(query);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Lấy chi tiết nhạc nền theo ID' })
  findById(@Body('id') id: string) {
    return this.musicService.findOne(id);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Tạo nhạc nền mới (audioUrl đã upload qua /api/upload)',
  })
  create(@Body() createDto: CreateMusicBackgroundDto) {
    createDto.type = 'admin';
    return this.musicService.create(createDto);
  }

  @Post('import-youtube')
  @ApiOperation({ summary: 'Nhập nhạc từ YouTube' })
  importYoutube(@Body() importDto: ImportYoutubeDto) {
    importDto.type = 'admin';
    return this.musicService.importYoutube(importDto);
  }

  @Post('import-youtube-library')
  @ApiOperation({
    summary: 'Nhập nhạc từ YouTube bằng thư viện youtube-dl-exec',
  })
  importYoutubeLibrary(@Body() importDto: ImportYoutubeDto) {
    return this.musicService.importYoutube({
      ...importDto,
      provider: 'youtube-dl-exec',
    });
  }

  @Post('import-youtube-public-api')
  @ApiOperation({ summary: 'Nhập nhạc từ YouTube bằng public internet API' })
  importYoutubePublicApi(@Body() importDto: ImportYoutubeDto) {
    return this.musicService.importYoutube({
      ...importDto,
      provider: 'public-api',
    });
  }

  @Post('import-youtube-python')
  @ApiOperation({ summary: 'Nhập nhạc từ YouTube bằng hàm Python yt-dlp' })
  importYoutubePython(@Body() importDto: ImportYoutubeDto) {
    return this.musicService.importYoutube({
      ...importDto,
      provider: 'python-yt-dlp',
    });
  }

  @Post('info')
  @ApiOperation({ summary: 'Lấy metadata YouTube (không tải)' })
  getYoutubeInfo(
    @Body('url') url: string,
    @Body('provider') provider?: YoutubeAudioProviderType,
  ) {
    return this.musicService.getYoutubeInfo(url, provider);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật nhạc nền' })
  update(@Body() updateDto: UpdateMusicBackgroundDto) {
    const { id, ...rest } = updateDto as any;
    return this.musicService.update(id, rest);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xóa nhạc nền' })
  remove(@Body('id') id: string) {
    return this.musicService.remove(id);
  }
}
