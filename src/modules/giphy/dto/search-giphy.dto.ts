import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class SearchGiphyDto {
  @ApiProperty({ description: "Search query", required: false })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ description: "Number of results", required: false, default: 25 })
  @IsOptional()
  limit?: number;

  @ApiProperty({ description: "Offset for pagination", required: false, default: 0 })
  @IsOptional()
  offset?: number;
}
