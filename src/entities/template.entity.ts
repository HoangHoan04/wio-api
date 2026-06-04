import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

// Giao diện thiệp cưới - quản lý bởi admin
@Entity('templates')
export class TemplateEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên mẫu giao diện' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  // Mô tả
  @ApiProperty({ description: 'Mô tả ngắn' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  // Tags
  @ApiProperty({ description: 'Tags' })
  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  // Tính năng
  @ApiProperty({ description: 'Cấu hình tính năng' })
  @Column({ type: 'json', nullable: true })
  features: any;

  // Ảnh đại diện
  @ApiProperty({ description: 'Đường dẫn ảnh thu nhỏ', required: false })
  @Column({ type: 'text', nullable: true })
  thumbnailUrl?: string | null;

  @ApiProperty({
    description: 'Mã giao diện',
    required: true,
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  // Theme Code
  @ApiProperty({ description: 'Theme Code' })
  themeCode: string;

  // Is Show
  @ApiProperty({ description: 'Trạng thái hiển thị' })
  @Column({ type: 'boolean', default: true, nullable: false })
  isShow: boolean;

  // Là giao diện Premium
  @ApiProperty({ description: 'Giao diện trả phí?' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isPremium: boolean;

  @ApiProperty({
    description: 'Gói tối thiểu để sử dụng (free | basic | premium)',
  })
  // Min Plan
  @Column({ type: 'varchar', length: 20, default: 'free', nullable: false })
  @ApiProperty({ description: 'Min Plan' })
  minPlan: string;

  // Trial Days
  @ApiProperty({ description: 'Số ngày dùng thử' })
  @Column({ type: 'int', default: 3, nullable: false })
  trialDays: number;
}
