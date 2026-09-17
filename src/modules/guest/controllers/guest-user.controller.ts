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
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('guest')
export class GuestUserController {
  constructor(private readonly service: GuestService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách khách mời' })
  async pagination(
    @CurrentUser() user: UserDto,
    @Body() body: PaginationDto<FilterGuestDto>,
  ) {
    return this.service.pagination(body, user);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết khách mời' })
  async findById(@CurrentUser() user: UserDto, @Body() body: IdDto) {
    return this.service.findById(body, user);
  }

  @Post('create')
  @ApiOperation({ summary: 'Tạo khách mời' })
  async create(@CurrentUser() user: UserDto, @Body() data: CreateGuestDto) {
    return this.service.create(user, data);
  }

  @Post('create-many')
  @ApiOperation({ summary: 'Tạo nhiều khách mời từ danh sách' })
  async createMany(
    @CurrentUser() user: UserDto,
    @Body() data: CreateManyGuestsDto,
  ) {
    return this.service.createMany(user, data);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật khách mời' })
  async update(@CurrentUser() user: UserDto, @Body() data: UpdateGuestDto) {
    return this.service.update(data, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xoá mềm khách mời' })
  async delete(@CurrentUser() user: UserDto, @Body() data: IdDto) {
    return this.service.delete(data, user);
  }

  @Post('generate-qr')
  @ApiOperation({ summary: 'Tạo mã QR cho khách mời' })
  async generateQr(
    @CurrentUser() user: UserDto,
    @Body() data: GenerateQrGuestDto,
  ) {
    return this.service.generateQrCode(data.id, user);
  }

  @Post('import-excel')
  @ApiOperation({ summary: 'Import danh sách khách mời từ Excel' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @CurrentUser() user: UserDto,
    @Body() data: ImportGuestExcelDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.importExcel(data.invitationId, file.buffer, user);
  }

  @Post('download-sample-excel')
  @ApiOperation({ summary: 'Tải file Excel mẫu nhập khách mời' })
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
