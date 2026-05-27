import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { UserDto } from '@/dto';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { TableService } from '../../table/table.service';

export class AssignGuestDto {
  @ApiProperty({ description: 'ID Khách mời' })
  @IsNotEmpty()
  @IsUUID()
  guestId: string;
}

@ApiTags('REST - Table')
@ApiBearerAuth()
@Controller('tables')
@UseGuards(JwtAuthGuard)
export class RestTableController {
  constructor(private readonly tableService: TableService) {}

  @Post(':id/assign')
  @ApiOperation({ summary: 'Gán khách vào bàn' })
  async assign(
    @Param('id') id: string,
    @Body() dto: AssignGuestDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.tableService.assignGuest(id, dto.guestId, user);
  }
}
