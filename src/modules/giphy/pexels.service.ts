import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PexelsService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.pexels.com/v1';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('PEXELS_API_KEY') || '';
  }

  async search(query: string, perPage = 20, page = 1) {
    const url = `${this.baseUrl}/search`;
    const response = await lastValueFrom(
      this.httpService.get(url, {
        headers: {
          Authorization: this.apiKey,
        },
        params: {
          query,
          per_page: perPage,
          page,
        },
      }),
    );
    return response.data;
  }

  async curated(perPage = 20, page = 1) {
    const url = `${this.baseUrl}/curated`;
    const response = await lastValueFrom(
      this.httpService.get(url, {
        headers: {
          Authorization: this.apiKey,
        },
        params: {
          per_page: perPage,
          page,
        },
      }),
    );
    return response.data;
  }
}
