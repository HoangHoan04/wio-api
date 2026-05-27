import { Controller, Post } from '@nestjs/common';
import { VisitorService } from '../visitor.service';

@Controller('visitor')
export class AdminVisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post('total-visitors')
  async getTotal() {
    return await this.visitorService.getTotalVisitors();
  }
}
