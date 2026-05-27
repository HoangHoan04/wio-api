import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

// Các gói dịch vụ - admin quản lý
@Entity('service_plans')
export class ServicePlanEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên gói (Free, Basic, Premium...)' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({ description: 'Số lượng khách tối đa' })
  @Column({ type: 'int', nullable: false })
  maxGuests: number;

  @ApiProperty({ description: 'Số lượng ảnh tối đa' })
  @Column({ type: 'int', nullable: false })
  maxPhotos: number;

  @ApiProperty({ description: 'Số lượng template tối đa' })
  @Column({ type: 'int', nullable: false })
  maxTemplates: number;

  @ApiProperty({ description: 'Có tính năng AI?' })
  @Column({ type: 'boolean', default: false, nullable: false })
  hasAi: boolean;

  @ApiProperty({ description: 'Có tính năng thống kê?' })
  @Column({ type: 'boolean', default: false, nullable: false })
  hasAnalytics: boolean;

  @ApiProperty({ description: 'Có slug tùy chỉnh?' })
  @Column({ type: 'boolean', default: false, nullable: false })
  hasCustomSlug: boolean;

  @ApiProperty({ description: 'Thời hạn (ngày)' })
  @Column({ type: 'int', nullable: false })
  durationDays: number;

  @ApiProperty({ description: 'Giá (VND)' })
  @Column({ type: 'bigint', nullable: false })
  priceVnd: number;

  @ApiProperty({ description: 'Trạng thái hoạt động' })
  @Column({ type: 'boolean', default: true, nullable: false })
  isActive: boolean;
}
