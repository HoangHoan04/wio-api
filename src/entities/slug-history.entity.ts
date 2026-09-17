import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('slug_history')
@Index(['oldSlug'], { unique: true })
export class SlugHistoryEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @Index()
  @Column({ type: 'uuid', nullable: false })
  invitationId: string;

  @ApiProperty({ description: 'Slug cũ trước khi đổi' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  oldSlug: string;

  @ApiProperty({ description: 'Slug mới sau khi đổi' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  newSlug: string;

  @ApiProperty({ description: 'ID user thực hiện thay đổi' })
  @Column({ type: 'uuid', nullable: false })
  changedBy: string;

  @ApiPropertyOptional({ description: 'Lý do thay đổi slug' })
  @Column({ type: 'text', nullable: true })
  reason?: string;

  @ManyToOne(() => InvitationEntity, (i) => i.slugHistories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;
}
