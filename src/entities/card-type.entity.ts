import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('card_types')
export class CardTypeEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 40, unique: true, nullable: false })
  @ApiProperty({ description: 'Mã loại thiệp' })
  code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Tên tiếng Việt' })
  nameVi: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: 'Tên tiếng Anh', required: false })
  nameEn?: string;

  @Column({ type: 'varchar', length: 80, unique: true, nullable: false })
  @ApiProperty({ description: 'Slug landing' })
  slug: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Mô tả', required: false })
  description?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Icon', required: false })
  icon?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Màu accent', required: false })
  accentColor?: string;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Module mặc định', required: false })
  defaultModules?: string[];

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Nhóm khách mặc định', required: false })
  defaultGuestGroups?: { code: string; name: string }[];

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Vai trò host', required: false })
  hostRoles?: { code: string; label: string; required: boolean; max: number }[];

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Section wizard', required: false })
  wizardSections?: string[];

  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({ description: 'Thứ tự' })
  sortOrder: number;

  @Column({ type: 'boolean', default: true, nullable: false })
  @ApiProperty({ description: 'Đang hoạt động' })
  isActive: boolean;
}
