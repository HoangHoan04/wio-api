import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { UserDto } from '@/dto';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateGuestDto } from '../../guest/dto';
import { GuestService } from '../../guest/guest.service';

@ApiTags('REST - Guest')
@ApiBearerAuth()
@Controller('guests')
@UseGuards(JwtAuthGuard)
export class RestGuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post()
  @ApiOperation({ summary: 'Thêm khách mời mới' })
  async create(@CurrentUser() user: UserDto, @Body() dto: CreateGuestDto) {
    return await this.guestService.create(user, dto);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Import hàng loạt từ Excel' })
  async import(
    @Query('weddingId') weddingId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: UserDto,
  ) {
    if (!file) throw new BadRequestException('Vui lòng tải lên file Excel');
    if (!weddingId)
      throw new BadRequestException('Vui lòng cung cấp weddingId');
    return await this.guestService.importExcel(weddingId, file.buffer, user);
  }

  @Get(':id/qr')
  @ApiOperation({ summary: 'Lấy QR Code cá nhân hóa' })
  async getQrCode(@Param('id') id: string, @CurrentUser() user: UserDto) {
    return await this.guestService.generateQrCode(id, user);
  }
}
