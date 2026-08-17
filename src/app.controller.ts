import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

const MAP_HOSTS = new Set([
  'maps.app.goo.gl',
  'goo.gl',
  'maps.google.com',
  'www.google.com',
  'google.com',
]);

function isAllowedMapUrl(value: string): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new BadRequestException('Invalid map URL');
  }

  if (url.protocol !== 'https:' || !MAP_HOSTS.has(url.hostname.toLowerCase())) {
    throw new BadRequestException('Only approved HTTPS map URLs are supported');
  }

  return url;
}

@ApiTags('Root')
@Controller()
export class AppController {
  @Get()
  root() {
    return {
      message: 'Wio API is running',
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
    };
  }

  @Get('api/health')
  apiHealth() {
    return this.health();
  }

  @Post('resolve-map-url')
  async resolveMapUrl(@Body() body: { url: string }) {
    let url = isAllowedMapUrl(body.url);

    for (let redirectCount = 0; redirectCount < 4; redirectCount += 1) {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'manual',
        signal: AbortSignal.timeout(5_000),
        headers: { 'User-Agent': 'WioMapResolver/1.0' },
      });
      const location = response.headers.get('location');
      if (!location || response.status < 300 || response.status >= 400) {
        return { message: 'Success', data: { url: url.toString() } };
      }
      url = isAllowedMapUrl(new URL(location, url).toString());
    }

    throw new BadRequestException('Too many map URL redirects');
  }
}
