import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { UserDto } from '@/dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GuestService } from '../../guest/guest.service';
import { TableService } from '../../table/table.service';
import { CreateWeddingDto, UpdateWeddingDto } from '../../wedding/dto';
import { WeddingService } from '../../wedding/wedding.service';

@ApiTags('REST - Wedding')
@ApiBearerAuth()
@Controller('weddings')
@UseGuards(JwtAuthGuard)
export class RestWeddingController {
  constructor(
    private readonly weddingService: WeddingService,
    private readonly guestService: GuestService,
    private readonly tableService: TableService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đám cưới mới' })
  async create(@CurrentUser() user: UserDto, @Body() dto: CreateWeddingDto) {
    // Force the wedding to belong to the logged-in user
    dto.userId = user.id;
    return await this.weddingService.create(user, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin đám cưới' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: UserDto,
    @Body() dto: UpdateWeddingDto,
  ) {
    dto.id = id;
    return await this.weddingService.update(dto, user);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish thiệp — kích hoạt slug URL' })
  async publish(@Param('id') id: string, @CurrentUser() user: UserDto) {
    return await this.weddingService.publish(id, user);
  }

  @Get(':id/share-url')
  @ApiOperation({ summary: 'Lấy URL thiệp + QR Code base64' })
  async getShareUrl(@Param('id') id: string, @CurrentUser() user: UserDto) {
    return await this.weddingService.getShareUrl(id, user);
  }

  @Get(':id/guests')
  @ApiOperation({ summary: 'Danh sách khách mời' })
  async getGuests(
    @Param('id') id: string,
    @Query() query: any,
    @CurrentUser() user: UserDto,
  ) {
    // Verify ownership
    await this.weddingService.getStats(id, user);
    return await this.guestService.pagination({
      where: { weddingId: id },
      skip: query.skip ? parseInt(query.skip) : 0,
      take: query.take ? parseInt(query.take) : 500,
    });
  }

  @Get(':id/tables')
  @ApiOperation({ summary: 'Danh sách bàn ăn' })
  async getTables(
    @Param('id') id: string,
    @Query() query: any,
    @CurrentUser() user: UserDto,
  ) {
    // Verify ownership
    await this.weddingService.getStats(id, user);
    return await this.tableService.pagination({
      where: { weddingId: id },
      skip: query.skip ? parseInt(query.skip) : 0,
      take: query.take ? parseInt(query.take) : 100,
    });
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Thống kê RSVP cho dashboard' })
  async getStats(@Param('id') id: string, @CurrentUser() user: UserDto) {
    return await this.weddingService.getStats(id, user);
  }
}
