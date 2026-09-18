import { enumData } from '@/common/constanst/enumData';
import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import {
  BadRequestException,
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
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  CreateTemplateDto,
  FilterTemplateDto,
  SetIsDeletedTemplateDto,
  SetIsShowTemplateDto,
  SetPremiumTemplateDto,
  UpdateTemplateDto,
} from '../dto';
import { TemplateService } from '../template.service';

@ApiTags('Admin - Template')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
@Controller('template')
export class TemplateAdminController {
  constructor(private readonly service: TemplateService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách template (phân trang)' })
  async pagination(@Body() body: PaginationDto<FilterTemplateDto>) {
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết template' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }

  @Post('create')
  @ApiOperation({ summary: 'Tạo template mới' })
  async create(@Body() data: CreateTemplateDto, @CurrentUser() user: UserDto) {
    return this.service.create(user, data);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật template' })
  async update(@Body() data: UpdateTemplateDto, @CurrentUser() user: UserDto) {
    return this.service.update(data, user);
  }

  @Post('set-premium')
  @ApiOperation({ summary: 'Đặt trạng thái premium' })
  async setPremium(
    @Body() body: SetPremiumTemplateDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.setPremium(body, user);
  }

  @Post('set-is-show')
  @ApiOperation({ summary: 'Đặt trạng thái hiển thị' })
  async setIsShow(
    @Body() body: SetIsShowTemplateDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.setIsShow(body, user);
  }

  @Post('set-is-deleted')
  @ApiOperation({ summary: 'Đặt trạng thái xoá mềm' })
  async setIsDeleted(
    @Body() body: SetIsDeletedTemplateDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.setIsDeleted(body, user);
  }

  @Post('download-sample-excel')
  @ApiOperation({ summary: 'Tải file Excel mẫu nhập mẫu thiệp' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header(
    'Content-Disposition',
    'attachment; filename="mau-thiep-sample.xlsx"',
  )
  async downloadSampleExcel(@Res() res: Response) {
    const buffer = await this.service.downloadSampleExcel();
    res.send(buffer);
  }

  @Post('import-excel')
  @ApiOperation({ summary: 'Nhập mẫu thiệp từ Excel' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @CurrentUser() user: UserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file?.buffer) {
      throw new BadRequestException('Vui lòng chọn file Excel');
    }
    return this.service.importExcel(file.buffer, user);
  }

  @Post('export-excel')
  @ApiOperation({ summary: 'Xuất danh sách mẫu thiệp ra Excel' })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename="mau-thiep.xlsx"')
  async exportExcel(
    @Body() body: FilterTemplateDto,
    @Res() res: Response,
  ) {
    const buffer = await this.service.exportExcel(body || {});
    res.send(buffer);
  }
}
