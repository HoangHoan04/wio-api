import { enumData } from '@/common/constanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('reviews')
@Index('IDX_review_status_pinned', ['status', 'isPinned', 'sortOrder'])
export class ReviewEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 150, nullable: false })
  @ApiProperty({ description: 'Tên người đánh giá' })
  authorName: string;

  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'Nội dung đánh giá' })
  content: string;

  @Column({ type: 'smallint', nullable: false })
  @ApiProperty({ description: 'Số sao (1-5)' })
  rating: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  @ApiProperty({ description: 'Nhãn hiển thị (vd. Thiệp cưới · 12/2025)', required: false })
  eventLabel?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Ảnh đại diện', required: false })
  avatarUrl?: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  @ApiProperty({ description: 'Loại thiệp', enum: enumData.CARD_TYPE, required: false })
  cardType?: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  @ApiProperty({ description: 'ID thiệp liên quan', required: false })
  invitationId?: string;

  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'ID user gửi đánh giá', required: false })
  userId?: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: 'PENDING' })
  @Index()
  @ApiProperty({ description: 'Trạng thái', enum: enumData.REVIEW_STATUS })
  status: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Ghim lên trang chủ' })
  isPinned: boolean;

  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({ description: 'Thứ tự hiển thị' })
  sortOrder: number;
}
