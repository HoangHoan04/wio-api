import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";

@Injectable()
export class GiphyService {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.giphy.com/v1";

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>("GIPHY_API_KEY") || "";
  }

  async search(query: string, limit = 25, offset = 0) {
    const url = `${this.baseUrl}/stickers/search`;
    const response = await lastValueFrom(
      this.httpService.get(url, {
        params: {
          api_key: this.apiKey,
          q: query,
          limit,
          offset,
          rating: "g",
          lang: "en",
        },
      }),
    );
    return response.data;
  }

  async trending(limit = 25, offset = 0) {
    const url = `${this.baseUrl}/stickers/trending`;
    const response = await lastValueFrom(
      this.httpService.get(url, {
        params: {
          api_key: this.apiKey,
          limit,
          offset,
          rating: "g",
        },
      }),
    );
    return response.data;
  }
}
