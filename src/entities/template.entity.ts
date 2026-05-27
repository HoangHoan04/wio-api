import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

// Giao diện thiệp cưới - quản lý bởi admin
@Entity('templates')
export class TemplateEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên mẫu giao diện' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @ApiProperty({ description: 'Đường dẫn ảnh thu nhỏ', required: false })
  @Column({ type: 'text', nullable: true })
  thumbnailUrl: string;

  @ApiProperty({
    description: 'Cấu hình màu sắc, font, layout dạng JSON',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  cssConfig: any;

  @ApiProperty({ description: 'Đường dẫn xem trước mẫu', required: false })
  @Column({ type: 'text', nullable: true })
  previewUrl: string;

  @ApiProperty({ description: 'Trạng thái hoạt động' })
  @Column({ type: 'boolean', default: true, nullable: false })
  isActive: boolean;

  @ApiProperty({ description: 'Giao diện trả phí?' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isPremium: boolean;

  @ApiProperty({
    description: 'Gói tối thiểu để sử dụng (free | basic | premium)',
  })
  @Column({ type: 'varchar', length: 20, default: 'free', nullable: false })
  minPlan: string;

  @ApiProperty({ description: 'Thứ tự sắp xếp' })
  @Column({ type: 'int', default: 0, nullable: false })
  sortOrder: number;
}
