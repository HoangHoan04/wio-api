import { enumData } from '@/common/constanst/enumData';
import { CurrentUser, RequireRoles } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateReviewDto, FilterReviewDto, UpdateReviewDto } from '../dto';
import { ReviewService } from '../review.service';

@ApiTags('Admin - Review')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@RequireRoles(enumData.USER_ROLE.ADMIN.code)
@Controller('review')
export class ReviewAdminController {
  constructor(private readonly service: ReviewService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Danh sách đánh giá' })
  async pagination(@Body() body: PaginationDto<FilterReviewDto>) {
    return this.service.pagination(body);
  }

  @Post('find-by-id')
  @ApiOperation({ summary: 'Chi tiết đánh giá' })
  async findById(@Body() body: IdDto) {
    return this.service.findById(body);
  }

  @Post('create')
  @ApiOperation({ summary: 'Admin tạo đánh giá' })
  async create(@Body() body: CreateReviewDto, @CurrentUser() user: UserDto) {
    return this.service.create(user, body);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật đánh giá' })
  async update(@Body() body: UpdateReviewDto, @CurrentUser() user: UserDto) {
    return this.service.update(body, user);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xoá mềm đánh giá' })
  async delete(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.delete(body, user);
  }

  @Post('approve')
  @ApiOperation({ summary: 'Duyệt đánh giá' })
  async approve(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.approve(body, user);
  }

  @Post('reject')
  @ApiOperation({ summary: 'Từ chối đánh giá' })
  async reject(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.reject(body, user);
  }

  @Post('pin')
  @ApiOperation({ summary: 'Ghim đánh giá lên trang chủ' })
  async pin(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.pin(body, user);
  }

  @Post('unpin')
  @ApiOperation({ summary: 'Bỏ ghim đánh giá' })
  async unpin(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return this.service.unpin(body, user);
  }
}
