import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('service_plans')
export class ServicePlanEntity extends BaseEntity {
  // Tên dịch vụ
  @Column({ type: 'varchar', length: 50, nullable: false })
  @ApiProperty({ description: 'Tên' })
  name: string;

  // Tối đa khách mời
  @Column({ type: 'int', nullable: false })
  @ApiProperty({ description: 'Tối đa khách mời' })
  maxGuests: number;

  // Số ảnh tối đa
  @Column({ type: 'int', nullable: false })
  @ApiProperty({ description: 'Số ảnh tối đa' })
  maxPhotos: number;

  // Số template tối đa
  @Column({ type: 'int', nullable: false })
  @ApiProperty({ description: 'Số template tối đa' })
  maxTemplates: number;

  // Có sử dụng AI không
  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Có sử dụng AI không' })
  hasAi: boolean;

  // Có phân tích dữ liệu không
  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Có phân tích dữ liệu không' })
  hasAnalytics: boolean;

  // Có slug tùy chỉnh không
  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Có slug tùy chỉnh không' })
  hasCustomSlug: boolean;

  // Số ngày hiệu lực
  @Column({ type: 'int', nullable: false })
  @ApiProperty({ description: 'Số ngày hiệu lực' })
  durationDays: number;

  // Giá VND
  @Column({ type: 'bigint', nullable: false })
  @ApiProperty({ description: 'Price Vnd' })
  priceVnd: number;

  // Có hoạt động không
  @Column({ type: 'boolean', default: true, nullable: false })
  @ApiProperty({ description: 'Có hoạt động không' })
  isActive: boolean;
}
