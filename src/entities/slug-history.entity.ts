import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Lưu lịch sử thay đổi slug của đám cưới
@Entity('slug_history')
export class SlugHistoryEntity {
  @ApiProperty({ description: 'ID khóa chính' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID Đám cưới' })
  @Column({ type: 'uuid', nullable: false })
  weddingId: string;

  @ApiProperty({ description: 'Slug cũ' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  oldSlug: string;

  @ApiProperty({ description: 'Slug mới' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  newSlug: string;

  @ApiProperty({ description: 'Người thực hiện thay đổi (User/Admin ID)' })
  @Column({ type: 'uuid', nullable: false })
  changedBy: string;

  @ApiProperty({ description: 'Lý do thay đổi' })
  @Column({ type: 'text', nullable: false })
  reason: string;

  @ApiProperty({ description: 'Thời điểm thay đổi' })
  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  createdAt: Date;
}
