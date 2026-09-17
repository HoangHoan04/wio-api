import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  BroadcastNotificationDto,
  CreateNotificationDto,
  FilterNotificationDto,
  UpdateNotificationDto,
} from '../dto';
import { NotificationService } from '../notification.service';

@ApiTags('User - Notification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationUserController {
  constructor(private readonly service: NotificationService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách thông báo của tôi' })
  async pagination(
    @Body() body: PaginationDto<FilterNotificationDto>,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.paginationForUser(body, user);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết thông báo' })
  async findById(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.findById(body, user);
  }

  @Post('create')
  @ApiOperation({ summary: 'Tạo thông báo cho thiệp của tôi' })
  async create(
    @Body() dto: CreateNotificationDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.create(user, dto);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật thông báo' })
  async update(
    @Body() dto: UpdateNotificationDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.update(dto, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xoá mềm thông báo' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.delete(body, user);
  }

  @Post('broadcast')
  @ApiOperation({ summary: 'Gửi thông báo cho toàn bộ khách mời của thiệp' })
  async broadcast(
    @Body() dto: BroadcastNotificationDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.broadcast(user, dto);
  }
}
