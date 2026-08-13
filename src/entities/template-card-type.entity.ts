import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TemplateEntity } from './template.entity';

@Entity('template_card_types')
@Index(['templateId', 'cardType'], { unique: true })
export class TemplateCardTypeEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID template' })
  templateId: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  @ApiProperty({ description: 'Mã loại thiệp' })
  cardType: string;

  @ManyToOne(() => TemplateEntity, (template) => template.cardTypes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'templateId' })
  template: TemplateEntity;
}
