import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('invitation_versions')
@Index(['invitationId', 'versionNumber'], { unique: true })
export class InvitationVersionEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @Column({ type: 'uuid', nullable: false })
  invitationId: string;

  @ApiProperty({ description: 'Số phiên bản (1, 2, 3…)' })
  @Column({ type: 'int', nullable: false })
  versionNumber: number;

  @ApiProperty({ description: 'Snapshot toàn bộ design state' })
  @Column({ type: 'jsonb', nullable: false })
  snapshot: Record<string, any>;

  @ApiPropertyOptional({ description: 'Ghi chú phiên bản' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  note?: string;

  @ApiPropertyOptional({ description: 'ID user tạo phiên bản' })
  @Column({ type: 'uuid', nullable: true })
  createdByUserId?: string;

  @ManyToOne(() => InvitationEntity, (i) => i.versions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;
}
