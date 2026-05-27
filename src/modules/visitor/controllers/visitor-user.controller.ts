import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { VisitorService } from '../visitor.service';

@Controller('visitor')
export class UserVisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post('record')
  async recordVisit(@Req() req: Request) {
    const rawIp =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const clientIp = Array.isArray(rawIp)
      ? rawIp[0]
      : rawIp.split(',')[0].trim();

    await this.visitorService.recordVisit(clientIp);
    return { success: true };
  }
}
