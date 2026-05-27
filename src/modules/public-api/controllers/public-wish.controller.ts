import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { WishService } from '../../wish/wish.service';

export class CreatePublicWishDto {
  @ApiProperty({ description: 'ID đám cưới' })
  @IsNotEmpty()
  @IsUUID()
  weddingId: string;

  @ApiProperty({ description: 'ID khách mời (optional)', required: false })
  @IsOptional()
  @IsUUID()
  guestId?: string;

  @ApiProperty({ description: 'Tên người gửi' })
  @IsNotEmpty()
  @IsString()
  guestName: string;

  @ApiProperty({ description: 'Nội dung lời chúc' })
  @IsNotEmpty()
  @IsString()
  content: string;
}

@ApiTags('Public - Wish')
@Controller('wishes')
export class PublicWishController {
  constructor(private readonly wishService: WishService) {}

  @Post()
  @ApiOperation({ summary: 'Khách gửi lời chúc' })
  async create(@Body() dto: CreatePublicWishDto) {
    // Default values for wishes submitted by public guests
    const data = {
      ...dto,
      isApproved: true, // auto-approve by default, or moderate later
      isPinned: false,
    };
    return await this.wishService.create({ id: 'visitor' } as any, data);
  }
}
