import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('service_plans')
export class ServicePlanEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50, nullable: false })
  @ApiProperty({ description: 'Tên' })
  name: string;

  @Column({ type: 'int', nullable: false, default: 1 })
  @ApiProperty({ description: 'Số thiệp tối đa' })
  maxInvitations: number;

  @Column({ type: 'int', nullable: false })
  @ApiProperty({ description: 'Tối đa khách mời' })
  maxGuests: number;

  @Column({ type: 'int', nullable: false })
  @ApiProperty({ description: 'Số ảnh tối đa' })
  maxPhotos: number;

  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Có sử dụng AI không' })
  hasAi: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Có phân tích dữ liệu không' })
  hasAnalytics: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Có slug tùy chỉnh không' })
  hasCustomSlug: boolean;

  @Column({ type: 'int', nullable: false })
  @ApiProperty({ description: 'Số ngày hiệu lực' })
  durationDays: number;

  @Column({ type: 'bigint', nullable: false })
  @ApiProperty({ description: 'Price Vnd' })
  priceVnd: number;

  @Column({ type: 'boolean', default: true, nullable: false })
  @ApiProperty({ description: 'Có hoạt động không' })
  isActive: boolean;
}
