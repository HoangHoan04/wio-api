import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ServicePlanEntity } from './service-plan.entity';

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

  // Gói tối thiểu để sử dụng
  @ApiProperty({ description: 'ID gói tối thiểu' })
  @Column({ name: 'min_plan_id', type: 'uuid', nullable: true })
  minPlanId?: string;

  @ManyToOne(() => ServicePlanEntity, { nullable: true })
  @JoinColumn({ name: 'min_plan_id' })
  minPlan: ServicePlanEntity;

  // Số ngày dùng thử
  @ApiProperty({ description: 'Số ngày dùng thử' })
  @Column({ type: 'int', default: 3, nullable: false })
  trialDays: number;

  // Số lượt dùng thiệp (khi user tạo wedding từ template)
  @ApiProperty({ description: 'Số lượt dùng thiệp' })
  @Column({ type: 'int', default: 0, nullable: false })
  viewCount: number;

  // Số lượt xem trước thiệp
  @ApiProperty({ description: 'Số lượt xem trước' })
  @Column({ type: 'int', default: 0, nullable: false })
  previewCount: number;
}
