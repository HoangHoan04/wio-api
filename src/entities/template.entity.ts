import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ServicePlanEntity } from './service-plan.entity';
import { TemplateCategoryEntity } from './template-category.entity';

@Entity('templates')
@Index(['slug'], { unique: true, where: `"isDeleted" = false` })
@Index(['weddingTheme', 'isShow'])
export class TemplateEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên template' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @ApiPropertyOptional({ description: 'Mô tả template' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @ApiProperty({ description: 'Slug định danh template' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  slug: string;

  @ApiProperty({ description: 'Phong cách cưới', enum: enumData.WEDDING_THEME })
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    default: enumData.WEDDING_THEME.CLASSIC.code,
  })
  weddingTheme: string;

  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm', type: [String] })
  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Tông màu chủ đạo' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  colorMood?: string;

  @ApiPropertyOptional({
    description: 'Cấu hình tính năng: {rsvp, gallery, music…}',
  })
  @Column({ type: 'jsonb', nullable: true })
  features?: Record<string, boolean>;

  @ApiPropertyOptional({ description: 'Bố cục section mặc định' })
  @Column({ type: 'jsonb', nullable: true })
  themeLayout?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Design tokens preset' })
  @Column({ type: 'jsonb', nullable: true })
  presetTokens?: Record<string, any>;

  @ApiPropertyOptional({ description: 'URL ảnh thumbnail' })
  @Column({ type: 'text', nullable: true })
  thumbnailUrl?: string;

  @ApiPropertyOptional({ description: 'URL xem trước template' })
  @Column({ type: 'text', nullable: true })
  previewUrl?: string;

  @ApiProperty({ description: 'Mã code giao diện (theme)' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  themeCode: string;

  @ApiProperty({ description: 'Hiển thị template cho người dùng' })
  @Column({ type: 'boolean', default: true, nullable: false })
  isShow: boolean;

  @ApiProperty({ description: 'Template trả phí?' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isPremium: boolean;

  @ApiPropertyOptional({ description: 'ID gói dịch vụ tối thiểu để dùng' })
  @Column({ name: 'min_plan_id', type: 'uuid', nullable: true })
  minPlanId?: string;

  @ApiProperty({ description: 'Số ngày dùng thử' })
  @Column({ type: 'int', default: 3, nullable: false })
  trialDays: number;

  @ApiProperty({ description: 'Lượt xem' })
  @Column({ type: 'int', default: 0, nullable: false })
  viewCount: number;

  @ApiProperty({ description: 'Số lượt sử dụng' })
  @Column({ type: 'int', default: 0, nullable: false })
  usedCount: number;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  @Column({ type: 'int', default: 0, nullable: false })
  sortOrder: number;

  @ManyToOne(() => ServicePlanEntity, { nullable: true })
  @JoinColumn({ name: 'min_plan_id' })
  minPlan?: ServicePlanEntity;

  @OneToMany(() => TemplateCategoryEntity, (c) => c.template, { cascade: true })
  categories: TemplateCategoryEntity[];
}
