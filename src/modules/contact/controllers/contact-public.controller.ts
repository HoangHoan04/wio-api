import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContactService } from '../contact.service';
import { CreateContactDto } from '../dto';

@ApiTags('Public - Contact')
@Controller('contact')
export class ContactPublicController {
  constructor(private readonly service: ContactService) {}

  @Post('create')
  @ApiOperation({ summary: 'Khách hàng gửi yêu cầu liên hệ / hỗ trợ' })
  async createPublicContact(@Body() body: CreateContactDto) {
    return this.service.createPublicContact(body);
  }
}
