import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('slug_history')
export class SlugHistoryEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @Index()
  @ApiProperty({ description: 'ID thiệp' })
  invitationId: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Đường dẫn cũ' })
  oldSlug: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Đường dẫn mới' })
  newSlug: string;

  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'Người thay đổi' })
  changedBy: string;

  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'Lý do' })
  reason: string;

  @ManyToOne(() => InvitationEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;
}
