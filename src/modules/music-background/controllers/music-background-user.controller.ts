import { enumData } from '@/common/constanst/enumData';
import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CancelImportDto,
  CreateMusicBackgroundDto,
  FilterMusicBackgroundDto,
  GetYoutubeInfoDto,
  ImportYoutubeDto,
} from '../dto';
import { MusicBackgroundService } from '../music-background.service';

@ApiTags('User - Music Background')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('music-background')
export class MusicBackgroundUserController {
  constructor(private readonly service: MusicBackgroundService) {}

  @Post('active')
  @ApiOperation({ summary: 'Danh sách nhạc nền đang hoạt động' })
  async findAllActive(
    @Body() query: PaginationDto<FilterMusicBackgroundDto>,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.paginationActive(query, user);
  }

  @Post('import-youtube')
  @ApiOperation({ summary: 'Khách hàng nhập nhạc từ YouTube' })
  async importYoutube(
    @Body() dto: ImportYoutubeDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.importYoutube(
      { ...dto, type: enumData.MUSIC_TYPE.USER.code },
      user,
    );
  }

  @Post('create')
  @ApiOperation({ summary: 'Khách hàng lưu thông tin nhạc tự upload' })
  async createUserMusic(
    @Body() dto: CreateMusicBackgroundDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.create(
      { ...dto, type: enumData.MUSIC_TYPE.USER.code },
      user,
    );
  }

  @Post('info')
  @ApiOperation({ summary: 'Lấy metadata YouTube (không tải)' })
  async getYoutubeInfo(@Body() dto: GetYoutubeInfoDto) {
    return this.service.getYoutubeInfo(dto);
  }

  @Post('increment-usage')
  @ApiOperation({ summary: 'Tăng lượt dùng bài hát' })
  async incrementUsage(@Body() dto: IdDto) {
    return this.service.incrementUsage(dto);
  }

  @Post('cancel-import')
  @ApiOperation({ summary: 'Huỷ quá trình import YouTube' })
  async cancelImport(@Body() dto: CancelImportDto) {
    return this.service.cancelImport(dto);
  }
}
