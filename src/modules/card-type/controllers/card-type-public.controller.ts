import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CardTypeService } from '../card-type.service';

@ApiTags('Public - CardType')
@Controller('card-type/public')
export class CardTypePublicController {
  constructor(private readonly service: CardTypeService) {}

  @Get('list')
  @ApiOperation({ summary: 'Danh sách loại thiệp' })
  async list() {
    return await this.service.listActive();
  }
}
