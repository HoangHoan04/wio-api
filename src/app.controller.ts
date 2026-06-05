import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import axios from 'axios';

@ApiTags('Root')
@Controller()
export class AppController {
  @Get()
  root() {
    return {
      message: 'Tiệm cưới tân thời API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  @Get('api/health')
  apiHealth() {
    return this.health();
  }

  @Post('resolve-map-url')
  async resolveMapUrl(@Body() body: { url: string }) {
    if (!body.url) {
      return { message: 'Đường dẫn trống', data: { url: '' } };
    }
    try {
      const res = await fetch(body.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      return { message: 'Thành công', data: { url: res.url } };
    } catch (e) {
      return { message: 'Lỗi', data: { url: body.url } };
    }
  }
}
