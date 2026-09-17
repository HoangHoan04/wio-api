import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AssignGuestDto,
  CreateTableDto,
  FilterTableDto,
  UnassignGuestDto,
  UpdateTableDto,
} from '../dto';
import { TableService } from '../table.service';

@ApiTags('User - Table')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('table')
export class TableUserController {
  constructor(private readonly service: TableService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách bàn tiệc' })
  async pagination(
    @Body() body: PaginationDto<FilterTableDto>,
    @CurrentUser() user: UserDto,
  ) {
    return this.service.pagination(body, user);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết bàn tiệc' })
  async findById(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.findById(body, user);
  }

  @Post('create')
  @ApiOperation({ summary: 'Tạo bàn tiệc' })
  async create(@CurrentUser() user: UserDto, @Body() body: CreateTableDto) {
    return this.service.create(user, body);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật bàn tiệc' })
  async update(@CurrentUser() user: UserDto, @Body() body: UpdateTableDto) {
    return this.service.update(body, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xoá bàn tiệc' })
  async delete(@CurrentUser() user: UserDto, @Body() body: IdDto) {
    return this.service.delete(body, user);
  }

  @Post('assign-guest')
  @ApiOperation({ summary: 'Xếp khách mời vào bàn tiệc' })
  async assignGuest(
    @CurrentUser() user: UserDto,
    @Body() body: AssignGuestDto,
  ) {
    return this.service.assignGuest(body, user);
  }

  @Post('unassign-guest')
  @ApiOperation({ summary: 'Gỡ khách mời khỏi bàn tiệc' })
  async unassignGuest(
    @CurrentUser() user: UserDto,
    @Body() body: UnassignGuestDto,
  ) {
    return this.service.unassignGuest(body.guestId, user);
  }
}
