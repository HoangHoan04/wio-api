import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateReviewDto, FilterReviewDto, UpdateReviewDto } from '../dto';
import { ReviewService } from '../review.service';

@ApiTags('Admin - Review')
@Controller('review')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles('ADMIN')
export class ReviewAdminController {
  constructor(private readonly service: ReviewService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách đánh giá' })
  async pagination(@Body() body: PaginationDto<FilterReviewDto>) {
    return await this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết đánh giá' })
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body);
  }

  @Post('create')
  @ApiOperation({ summary: 'Tạo đánh giá (admin)' })
  async create(@Body() body: CreateReviewDto, @CurrentUser() user: UserDto) {
    return await this.service.create(user, body);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật đánh giá' })
  async update(@Body() body: UpdateReviewDto, @CurrentUser() user: UserDto) {
    return await this.service.update(body, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xóa đánh giá' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.delete(body, user);
  }

  @Post('approve')
  @ApiOperation({ summary: 'Duyệt đánh giá' })
  async approve(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.approve(body, user);
  }

  @Post('reject')
  @ApiOperation({ summary: 'Từ chối đánh giá' })
  async reject(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.reject(body, user);
  }

  @Post('pin')
  @ApiOperation({ summary: 'Ghim đánh giá trang chủ' })
  async pin(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.pin(body, user);
  }

  @Post('unpin')
  @ApiOperation({ summary: 'Bỏ ghim đánh giá' })
  async unpin(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.unpin(body, user);
  }
}
