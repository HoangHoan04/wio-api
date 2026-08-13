import { enumData } from '@/common/constanst/enumData';
import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardTypeService } from '../card-type.service';

@ApiTags('Admin - CardType')
@Controller('card-type')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
export class CardTypeAdminController {
  constructor(private readonly service: CardTypeService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Phân trang loại thiệp' })
  async pagination(@Body() body: PaginationDto) {
    return await this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết loại thiệp' })
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }

  @Post('sync-enum')
  @ApiOperation({ summary: 'Đồng bộ loại thiệp từ enum' })
  async syncEnum(@CurrentUser() user: UserDto) {
    return await this.service.upsertFromEnum(user);
  }
}
