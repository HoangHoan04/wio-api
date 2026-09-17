import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('reviews')
@Index('IDX_review_status_pinned', ['status', 'isPinned', 'sortOrder'])
export class ReviewEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên người đánh giá' })
  @Column({ type: 'varchar', length: 150, nullable: false })
  authorName: string;

  @ApiProperty({ description: 'Nội dung đánh giá' })
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty({ description: 'Số sao đánh giá (1-5)' })
  @Column({ type: 'smallint', nullable: false })
  rating: number;

  @ApiPropertyOptional({
    description: 'Nhãn sự kiện (VD: Thiệp cưới · 12/2025)',
  })
  @Column({ type: 'varchar', length: 150, nullable: true })
  eventLabel?: string;

  @ApiPropertyOptional({ description: 'URL ảnh đại diện người đánh giá' })
  @Column({ type: 'text', nullable: true })
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Phong cách cưới',
    enum: enumData.WEDDING_THEME,
  })
  @Column({ type: 'varchar', length: 30, nullable: true })
  weddingTheme?: string;

  @ApiPropertyOptional({ description: 'ID thiệp cưới liên quan' })
  @Index()
  @Column({ type: 'uuid', nullable: true })
  invitationId?: string;

  @ApiPropertyOptional({ description: 'ID user gửi đánh giá' })
  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @ApiProperty({
    description: 'Trạng thái duyệt',
    enum: enumData.REVIEW_STATUS,
  })
  @Index()
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: enumData.REVIEW_STATUS.PENDING.code,
  })
  status: string;

  @ApiProperty({ description: 'Ghim đánh giá lên đầu' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isPinned: boolean;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  @Column({ type: 'int', default: 0, nullable: false })
  sortOrder: number;
}
