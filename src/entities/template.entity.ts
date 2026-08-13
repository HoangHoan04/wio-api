import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ServicePlanEntity } from './service-plan.entity';
import { TemplateCardTypeEntity } from './template-card-type.entity';

@Entity('templates')
export class TemplateEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên mẫu giao diện' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @ApiProperty({ description: 'Mô tả ngắn' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @ApiProperty({ description: 'Slug' })
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  slug: string;

  @ApiProperty({ description: 'Tags' })
  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @ApiProperty({ description: 'Phong cách' })
  @Column({ type: 'simple-array', nullable: true })
  styleTags?: string[];

  @ApiProperty({ description: 'Mood màu' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  colorMood?: string;

  @ApiProperty({ description: 'Cấu hình tính năng' })
  @Column({ type: 'json', nullable: true })
  features?: any;

  @ApiProperty({ description: 'Đường dẫn ảnh thu nhỏ', required: false })
  @Column({ type: 'text', nullable: true })
  thumbnailUrl?: string;

  @ApiProperty({ description: 'Mã giao diện', required: true })
  @Column({ type: 'varchar', length: 100, nullable: false })
  themeCode: string;

  @ApiProperty({ description: 'Trạng thái hiển thị' })
  @Column({ type: 'boolean', default: true, nullable: false })
  isShow: boolean;

  @ApiProperty({ description: 'Giao diện trả phí?' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isPremium: boolean;

  @ApiProperty({ description: 'ID gói tối thiểu' })
  @Column({ name: 'min_plan_id', type: 'uuid', nullable: true })
  minPlanId?: string;

  @ManyToOne(() => ServicePlanEntity, { nullable: true })
  @JoinColumn({ name: 'min_plan_id' })
  minPlan: ServicePlanEntity;

  @ApiProperty({ description: 'Số ngày dùng thử' })
  @Column({ type: 'int', default: 3, nullable: false })
  trialDays: number;

  @ApiProperty({ description: 'Số lượt dùng thiệp' })
  @Column({ type: 'int', default: 0, nullable: false })
  viewCount: number;

  @ApiProperty({ description: 'Số lượt xem trước' })
  @Column({ type: 'int', default: 0, nullable: false })
  previewCount: number;

  @OneToMany(() => TemplateCardTypeEntity, (item) => item.template, {
    cascade: true,
  })
  cardTypes: TemplateCardTypeEntity[];
}
