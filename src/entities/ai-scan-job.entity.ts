import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('ai_scan_jobs')
@Index(['invitationId', 'status'])
export class AiScanJobEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thiệp cưới (nullable đến lúc apply)' })
  @Column({ type: 'uuid', nullable: true })
  invitationId?: string;

  @ApiProperty({ description: 'ID user upload ảnh' })
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @ApiProperty({ description: 'URL ảnh gốc user upload' })
  @Column({ type: 'text', nullable: false })
  sourceImageUrl: string;

  @ApiPropertyOptional({ description: 'Storage key ảnh gốc' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  sourceStorageKey?: string;

  @ApiProperty({ description: 'Trạng thái xử lý' })
  @Index()
  @Column({ type: 'varchar', length: 30, nullable: false })
  status: string;

  @ApiPropertyOptional({ description: 'Nhà cung cấp AI xử lý' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  provider?: string;

  @ApiPropertyOptional({ description: 'Kết quả AI trả về' })
  @Column({ type: 'jsonb', nullable: true })
  result?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Nội dung đã trích từ ảnh' })
  @Column({ type: 'jsonb', nullable: true })
  extractedContent?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Design Canva/theme đã dựng' })
  @Column({ type: 'jsonb', nullable: true })
  reconstructedDesign?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Design tokens đã mapping' })
  @Column({ type: 'jsonb', nullable: true })
  designTokens?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Thông báo lỗi nếu thất bại' })
  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @ApiProperty({ description: 'Số lần thử lại' })
  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @ApiPropertyOptional({ description: 'Thời điểm bắt đầu xử lý' })
  @Column({ type: 'timestamptz', nullable: true })
  startedAt?: Date;

  @ApiPropertyOptional({ description: 'Thời điểm hoàn tất xử lý' })
  @Column({ type: 'timestamptz', nullable: true })
  finishedAt?: Date;

  @ManyToOne(() => InvitationEntity, (i) => i.aiScanJobs, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'invitationId' })
  invitation?: InvitationEntity;
}
