import { enumData } from '@/common/constanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TemplateEntity } from './template.entity';

@Entity('template_categories')
@Index(['templateId', 'category'], { unique: true })
export class TemplateCategoryEntity extends BaseEntity {
  @ApiProperty({ description: 'ID template' })
  @Column({ type: 'uuid', nullable: false })
  templateId: string;

  @ApiProperty({ description: 'Phong cách cưới', enum: enumData.WEDDING_THEME })
  @Column({ type: 'varchar', length: 30, nullable: false })
  category: string;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  @Column({ type: 'int', default: 0, nullable: false })
  sortOrder: number;

  @ManyToOne(() => TemplateEntity, (t) => t.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'templateId' })
  template: TemplateEntity;
}
