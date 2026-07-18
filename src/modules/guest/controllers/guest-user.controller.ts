import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import {
  Body,
  Controller,
  Header,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  CreateGuestDto,
  CreateManyGuestsDto,
  FilterGuestDto,
  GenerateQrGuestDto,
  ImportGuestExcelDto,
  UpdateGuestDto,
} from '../dto';
import { GuestService } from '../guest.service';

@ApiTags('User - Guest')
@Controller('guest')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GuestUserController {
  constructor(private readonly service: GuestService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách' })
  async pagination(
    @CurrentUser() user: UserDto,
    @Body() body: PaginationDto<FilterGuestDto>,
  ) {
    return await this.service.pagination(body, user);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  async findById(@CurrentUser() user: UserDto, @Body() body: IdDto) {
    return await this.service.findById(body, user);
  }

  @ApiOperation({ summary: 'Tạo khách mời' })
  @Post('create')
  async create(@CurrentUser() user: UserDto, @Body() data: CreateGuestDto) {
    return await this.service.create(user, data);
  }

  @ApiOperation({ summary: 'Cập nhật khách mời' })
  @Post('update')
  async update(@CurrentUser() user: UserDto, @Body() data: UpdateGuestDto) {
    return await this.service.update(data, user);
  }

  @ApiOperation({ summary: 'Xóa mềm khách mời' })
  @Post('delete')
  async delete(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return await this.service.delete(data, user);
  }

  @ApiOperation({ summary: 'Tạo mã QR cho khách mời' })
  @Post('generate-qr')
  async generateQr(
    @CurrentUser() user: UserDto,
    @Body() data: GenerateQrGuestDto,
  ) {
    return await this.service.generateQrCode(data.id, user);
  }

  @ApiOperation({ summary: 'Import danh sách khách mời từ Excel' })
  @Post('import-excel')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @CurrentUser() user: UserDto,
    @Body() data: ImportGuestExcelDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.service.importExcel(data.weddingId, file.buffer, user);
  }

  @ApiOperation({ summary: 'Tạo nhiều khách mời từ danh sách' })
  @Post('create-many')
  async createMany(
    @CurrentUser() user: UserDto,
    @Body() data: CreateManyGuestsDto,
  ) {
    return await this.service.createMany(user, data);
  }

  @ApiOperation({ summary: 'Tải file Excel mẫu nhập khách mời' })
  @Post('download-sample-excel')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename="guest-sample.xlsx"')
  async downloadSampleExcel(@Res() res: Response) {
    const buffer = await this.service.downloadSampleExcel();
    res.send(buffer);
  }
}
