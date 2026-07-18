import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AssignGuestDto,
  CreateTableDto,
  FilterTableDto,
  UpdateTableDto,
  UnassignGuestDto,
} from '../dto';
import { TableService } from '../table.service';

@ApiTags('User - Table')
@Controller('table')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TableUserController {
  constructor(private readonly service: TableService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách' })
  async pagination(@Body() body: PaginationDto<FilterTableDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }

  @Post('create')
  @ApiOperation({ summary: 'Tạo mới bàn tiệc' })
  async create(@CurrentUser() user: UserDto, @Body() body: CreateTableDto) {
    return await this.service.create(user, body);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật bàn tiệc' })
  async update(@CurrentUser() user: UserDto, @Body() body: UpdateTableDto) {
    return await this.service.update(body, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xóa bàn tiệc' })
  async delete(@CurrentUser() user: UserDto, @Body() body: IdDto) {
    return await this.service.delete(body, user);
  }

  @Post('assign-guest')
  @ApiOperation({ summary: 'Xếp khách mời vào bàn tiệc' })
  async assignGuest(
    @CurrentUser() user: UserDto,
    @Body() body: AssignGuestDto,
  ) {
    return await this.service.assignGuest(body.tableId, body.guestId, user);
  }

  @Post('unassign-guest')
  @ApiOperation({ summary: 'Gỡ khách mời khỏi bàn tiệc' })
  async unassignGuest(
    @CurrentUser() user: UserDto,
    @Body() body: UnassignGuestDto,
  ) {
    return await this.service.unassignGuest(body.guestId, user);
  }
}
