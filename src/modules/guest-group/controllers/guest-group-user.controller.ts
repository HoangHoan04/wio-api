import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterGuestGroupDto } from '../dto';
import { GuestGroupService } from '../guest-group.service';

@ApiTags('User - GuestGroup')
@Controller('guest-group')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class GuestGroupUserController {
  constructor(private readonly service: GuestGroupService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách' })
  async pagination(@Body() body: PaginationDto<FilterGuestGroupDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Chi tiết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }
}
