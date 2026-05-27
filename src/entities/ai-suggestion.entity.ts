import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AiTarget, AiTone } from './enums';

// Lịch sử sinh nội dung lời mời bằng AI - theo nhóm quan hệ và văn phong
@Entity('ai_suggestions')
export class AiSuggestionEntity extends BaseEntity {
  @ApiProperty({ description: 'ID Đám cưới' })
  @Column({ type: 'uuid', nullable: false })
  @Index()
  weddingId: string;

  @ApiProperty({ description: 'Nhóm đối tượng', enum: AiTarget })
  @Column({ type: 'enum', enum: AiTarget, nullable: false })
  targetGroup: AiTarget;

  @ApiProperty({ description: 'Văn phong', enum: AiTone })
  @Column({ type: 'enum', enum: AiTone, nullable: false })
  tone: AiTone;

  @ApiProperty({ description: 'Ngôn ngữ (vi, en)' })
  @Column({ type: 'varchar', length: 5, default: 'vi', nullable: false })
  language: string;

  @ApiProperty({ description: 'Yêu cầu bổ sung', required: false })
  @Column({ type: 'text', nullable: true })
  customPrompt: string;

  @ApiProperty({ description: 'Nội dung sinh ra' })
  @Column({ type: 'text', nullable: false })
  generatedText: string;

  @ApiProperty({
    description: 'Model sử dụng (gemini-pro, gpt-4...)',
    required: false,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  modelUsed: string;

  @ApiProperty({ description: 'Số token đã sử dụng', required: false })
  @Column({ type: 'int', nullable: true })
  tokensUsed: number;

  @ApiProperty({ description: 'Đã sử dụng?' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isUsed: boolean;

  @ApiProperty({ description: 'Thời điểm sử dụng', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  usedAt: Date;
}
