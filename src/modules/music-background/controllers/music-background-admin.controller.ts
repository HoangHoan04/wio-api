import { enumData } from '@/common/constanst/enumData';
import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateMusicBackgroundDto,
  FilterMusicBackgroundDto,
  GetYoutubeInfoDto,
  ImportYoutubeDto,
  UpdateMusicBackgroundDto,
} from '../dto';
import { MusicBackgroundService } from '../music-background.service';

@ApiTags('Admin - Music Background')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
@Controller('music-background')
export class MusicBackgroundAdminController {
  constructor(private readonly service: MusicBackgroundService) {}

  /* ============================================================
   * CRUD
   * ============================================================ */
  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách nhạc nền (phân trang)' })
  async pagination(@Body() query: PaginationDto<FilterMusicBackgroundDto>) {
    return this.service.pagination(query);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết nhạc nền theo ID' })
  async findById(@Body() dto: IdDto) {
    return this.service.findById(dto.id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Tạo nhạc nền mới (audioUrl đã upload)' })
  async create(
    @Body() dto: CreateMusicBackgroundDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.create(
      { ...dto, type: enumData.MUSIC_TYPE.ADMIN.code },
      user,
    );
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật nhạc nền' })
  async update(
    @Body() dto: UpdateMusicBackgroundDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.update(dto, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xoá mềm nhạc nền' })
  async remove(@Body() dto: IdDto, @CurrentUser() user: UserDto) {
    return this.service.remove(dto.id, user);
  }

  /* ============================================================
   * YOUTUBE
   * ============================================================ */
  @Post('import-youtube')
  @ApiOperation({ summary: 'Nhập nhạc từ YouTube' })
  async importYoutube(
    @Body() dto: ImportYoutubeDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.importYoutube(
      { ...dto, type: enumData.MUSIC_TYPE.ADMIN.code },
      user,
    );
  }

  @Post('info')
  @ApiOperation({ summary: 'Lấy metadata YouTube (không tải)' })
  async getYoutubeInfo(@Body() dto: GetYoutubeInfoDto) {
    return this.service.getYoutubeInfo(dto);
  }
}
