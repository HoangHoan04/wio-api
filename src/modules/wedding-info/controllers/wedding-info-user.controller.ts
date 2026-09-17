import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateWeddingInfoDto,
  FilterWeddingInfoDto,
  UpdateWeddingInfoDto,
} from '../dto';
import { WeddingInfoService } from '../wedding-info.service';

@ApiTags('User - WeddingInfo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wedding-info')
export class WeddingInfoUserController {
  constructor(private readonly service: WeddingInfoService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách thông tin cặp đôi của tôi' })
  async pagination(
    @Body() body: PaginationDto<FilterWeddingInfoDto>,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.paginationForUser(body, user);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết thông tin cặp đôi' })
  async findById(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.findById(body, user);
  }

  @Post('find-by-invitation')
  @ApiOperation({ summary: 'Lấy theo ID thiệp' })
  async findByInvitation(
    @Body() body: { invitationId: string },
    @CurrentUser() user: UserDto,
  ) {
    return this.service.findByInvitationId(body.invitationId);
  }

  @Post('create')
  @ApiOperation({ summary: 'Tạo thông tin cặp đôi cho thiệp' })
  async create(
    @Body() dto: CreateWeddingInfoDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.create(user, dto);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật thông tin cặp đôi' })
  async update(
    @Body() dto: UpdateWeddingInfoDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.update(dto, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xoá mềm thông tin cặp đôi' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.delete(body, user);
  }
}
