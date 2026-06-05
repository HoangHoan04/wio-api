import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MusicBackgroundService } from '../music-background.service';
import { CreateMusicBackgroundDto, UpdateMusicBackgroundDto, ImportYoutubeDto } from '../dto';
import { JwtAuthGuard } from '@/common/guards';
import { RequireRoles } from '@/common/decorators';

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
  @ApiOperation({ summary: 'Tạo nhạc nền mới (audioUrl đã upload qua /api/upload)' })
  create(@Body() createDto: CreateMusicBackgroundDto) {
    return this.musicService.create(createDto);
  }

  @Post('import-youtube')
  @ApiOperation({ summary: 'Nhập nhạc từ YouTube' })
  importYoutube(@Body() importDto: ImportYoutubeDto) {
    return this.musicService.importYoutube(importDto);
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
