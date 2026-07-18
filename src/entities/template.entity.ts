import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('templates')
export class TemplateEntity extends BaseEntity {
  // Tên mẫu giao diện
  @ApiProperty({ description: 'Tên mẫu giao diện' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  // Mô tả
  @ApiProperty({ description: 'Mô tả ngắn' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  // slug
  @ApiProperty({ description: 'Slug' })
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  slug: string;

  // Tags
  @ApiProperty({ description: 'Tags' })
  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  // Tính năng
  @ApiProperty({ description: 'Cấu hình tính năng' })
  @Column({ type: 'json', nullable: true })
  features?: any;

  // Ảnh đại diện
  @ApiProperty({ description: 'Đường dẫn ảnh thu nhỏ', required: false })
  @Column({ type: 'text', nullable: true })
  thumbnailUrl?: string;

  // Theme Code
  @ApiProperty({ description: 'Mã giao diện', required: true })
  @Column({ type: 'varchar', length: 100, nullable: false })
  themeCode: string;

  // Trạng thái hiển thị
  @ApiProperty({ description: 'Trạng thái hiển thị' })
  @Column({ type: 'boolean', default: true, nullable: false })
  isShow: boolean;

  // Là giao diện Premium
  @ApiProperty({ description: 'Giao diện trả phí?' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isPremium: boolean;

  @ApiProperty({ description: 'Gói tối thiểu để sử dụng' })
  // Gói tối thiểu để sử dụng
  @Column({ type: 'varchar', length: 20, default: 'free', nullable: false })
  @ApiProperty({ description: 'Gói tối thiểu' })
  minPlan: string;

  // Số ngày dùng thử
  @ApiProperty({ description: 'Số ngày dùng thử' })
  @Column({ type: 'int', default: 3, nullable: false })
  trialDays: number;
}
