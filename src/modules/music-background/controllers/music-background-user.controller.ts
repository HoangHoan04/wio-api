import { IdDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMusicBackgroundDto, ImportYoutubeDto } from '../dto';
import { MusicBackgroundService } from '../music-background.service';
import { YoutubeAudioProviderType } from '../../youtube-audio';
import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';

@ApiTags('User - Music Background')
@Controller('music-background')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MusicBackgroundUserController {
  constructor(private readonly musicService: MusicBackgroundService) {}

  @Post('active')
  @ApiOperation({ summary: 'Lấy danh sách nhạc nền hoạt động' })
  findAllActive(@Body() query: any, @CurrentUser() user: UserDto) {
    return this.musicService.paginationActive(query, user);
  }

  @Post('import-youtube')
  @ApiOperation({ summary: 'Khách hàng nhập nhạc từ YouTube' })
  importYoutube(@Body() importDto: ImportYoutubeDto, @CurrentUser() user: UserDto) {
    return this.musicService.importYoutube(importDto, user);
  }

  @Post('create')
  @ApiOperation({ summary: 'Khách hàng lưu thông tin nhạc tự upload' })
  createUserMusic(@Body() createDto: CreateMusicBackgroundDto, @CurrentUser() user: UserDto) {
    createDto.type = 'user';
    return this.musicService.create(createDto, user);
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

  @Post('cancel-import')
  @ApiOperation({ summary: 'Hủy quá trình import YouTube' })
  cancelImport(@Body('url') url: string) {
    return this.musicService.cancelImport(url);
  }
}
