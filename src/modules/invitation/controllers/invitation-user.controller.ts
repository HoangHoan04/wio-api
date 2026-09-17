import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CheckSlugDto,
  CreateInvitationDto,
  FilterInvitationDto,
  UpdateInvitationDto,
} from '../dto';
import { InvitationService } from '../invitation.service';

@ApiTags('User - Invitation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invitation')
export class InvitationUserController {
  constructor(private readonly service: InvitationService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách thiệp của người dùng' })
  async pagination(
    @Body() body: PaginationDto<FilterInvitationDto>,
    @CurrentUser() user: UserDto,
  ) {
    body.where = { ...body.where, userId: user.id };
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết thiệp' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }

  @Post('create')
  @ApiOperation({ summary: 'Tạo thiệp mới' })
  async create(
    @Body() data: CreateInvitationDto,
    @CurrentUser() user: UserDto,
  ) {
    data.userId = user.id;
    return this.service.create(user, data);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật thiệp' })
  async update(
    @Body() data: UpdateInvitationDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.update(data, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xóa thiệp' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.delete(body, user);
  }

  @Post('publish')
  @ApiOperation({ summary: 'Xuất bản thiệp' })
  async publish(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.publish(body.id, user);
  }

  @Post('unpublish')
  @ApiOperation({ summary: 'Hủy xuất bản (về nháp)' })
  async unpublish(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.unpublish(body.id, user);
  }

  @Post('archive')
  @ApiOperation({ summary: 'Lưu trữ thiệp' })
  async archive(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.archive(body.id, user);
  }

  @Post('check-slug')
  @ApiOperation({ summary: 'Kiểm tra slug còn trống' })
  async checkSlug(@Body() body: CheckSlugDto) {
    return this.service.checkSlug(body);
  }

  @Post('share-url')
  @ApiOperation({ summary: 'Lấy link chia sẻ + QR' })
  async getShareUrl(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.getShareUrl(body.id, user);
  }
}
