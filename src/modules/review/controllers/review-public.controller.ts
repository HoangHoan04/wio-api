import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicCreateReviewDto, PublicReviewListDto } from '../dto';
import { ReviewService } from '../review.service';

@ApiTags('Public - Review')
@Controller('review/public')
export class ReviewPublicController {
  constructor(private readonly service: ReviewService) {}

  @Get('list')
  @ApiOperation({ summary: 'Danh sách đánh giá đã duyệt cho trang chủ' })
  async list(@Query() query: PublicReviewListDto) {
    return await this.service.listPublic(query);
  }

  @Post('create')
  @ApiOperation({ summary: 'Khách gửi đánh giá (chờ duyệt)' })
  async create(@Body() body: PublicCreateReviewDto) {
    return await this.service.createPublic(body);
  }
}
