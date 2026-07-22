import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContactService } from '../contact.service';
import { CreateContactDto } from '../dto';

@ApiTags('Public - Contact')
@Controller('contact/public')
export class ContactPublicController {
  constructor(private readonly service: ContactService) {}

  @ApiOperation({ summary: 'Khách hàng gửi yêu cầu liên hệ / hỗ trợ' })
  @Post('create')
  async createPublicContact(@Body() body: CreateContactDto) {
    return await this.service.createPublicContact(body);
  }
}
