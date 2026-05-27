import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

// Lời chúc từ khách mời - hiển thị trên Bức tường kỷ niệm
@Entity('wishes')
@Index(['weddingId', 'isApproved'])
export class WishEntity extends BaseEntity {
  @ApiProperty({ description: 'ID Đám cưới' })
  @Column({ type: 'uuid', nullable: false })
  weddingId: string;

  @ApiProperty({
    description: 'ID Khách mời (Null nếu không có mã)',
    required: false,
  })
  @Column({ type: 'uuid', nullable: true })
  guestId: string;

  // --- Nội dung ---
  @ApiProperty({ description: 'Tên người gửi (Fallback nếu guestId null)' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  guestName: string;

  @ApiProperty({ description: 'Nội dung lời chúc' })
  @Column({ type: 'text', nullable: false })
  content: string;

  // --- Kiểm duyệt ---
  @ApiProperty({ description: 'Đã duyệt?' })
  @Column({ type: 'boolean', default: true, nullable: false })
  isApproved: boolean;

  @ApiProperty({ description: 'Ghim lên đầu?' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isPinned: boolean;

  @ApiProperty({ description: 'Thời gian duyệt', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  approvedAt: Date;
}
