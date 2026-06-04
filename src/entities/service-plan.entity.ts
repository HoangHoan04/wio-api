import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

// ==================== SERVICE PLANS ====================
@Entity('service_plans')
export class ServicePlanEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50, nullable: false })
  @ApiProperty({ description: 'Tên' })
  name: string;

  // Max Guests
  @Column({ type: 'int', nullable: false })
  @ApiProperty({ description: 'Max Guests' })
  maxGuests: number;

  // Số ảnh tối đa
  @Column({ type: 'int', nullable: false })
  @ApiProperty({ description: 'Số ảnh tối đa' })
  maxPhotos: number;

  // Max Templates
  @Column({ type: 'int', nullable: false })
  @ApiProperty({ description: 'Max Templates' })
  maxTemplates: number;

  // Has Ai
  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Has Ai' })
  hasAi: boolean;

  // Has Analytics
  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Has Analytics' })
  hasAnalytics: boolean;

  // Has Custom Slug
  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Has Custom Slug' })
  hasCustomSlug: boolean;

  // Số ngày hiệu lực
  @Column({ type: 'int', nullable: false })
  @ApiProperty({ description: 'Số ngày hiệu lực' })
  durationDays: number;

  // Price Vnd
  @Column({ type: 'bigint', nullable: false })
  @ApiProperty({ description: 'Price Vnd' })
  priceVnd: number;

  // Is Active
  @Column({ type: 'boolean', default: true, nullable: false })
  @ApiProperty({ description: 'Is Active' })
  isActive: boolean;
}
