import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class VisitorService {
  private readonly logger = new Logger(VisitorService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async recordVisit(ip: string) {}

  async getTotalVisitors() {}
}
