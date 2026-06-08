import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { GiphyUserController } from "./controllers/giphy-user.controller";
import { GiphyService } from "./giphy.service";
import { PexelsService } from "./pexels.service";

@Module({
  imports: [HttpModule],
  controllers: [GiphyUserController],
  providers: [GiphyService, PexelsService],
  exports: [GiphyService, PexelsService],
})
export class GiphyModule {}
