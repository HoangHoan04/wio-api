import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('invitation_hosts')
@Index(['invitationId', 'role'])
export class InvitationHostEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @Column({ type: 'uuid', nullable: false })
  invitationId: string;

  @ApiProperty({
    description: 'Vai trò của người xuất hiện trên thiệp',
    enum: enumData.HOST_ROLE,
  })
  @Column({ type: 'varchar', length: 40, nullable: false })
  role: string;

  @ApiProperty({ description: 'Họ và tên đầy đủ' })
  @Column({ type: 'varchar', length: 150, nullable: false })
  fullName: string;

  @ApiPropertyOptional({ description: 'Tên ngắn hiển thị' })
  @Column({ type: 'varchar', length: 80, nullable: true })
  shortName?: string;

  @ApiPropertyOptional({ description: 'URL ảnh đại diện' })
  @Column({ type: 'text', nullable: true })
  photoUrl?: string;

  @ApiPropertyOptional({
    description: 'Liên kết mạng xã hội (facebook, instagram…)',
  })
  @Column({ type: 'jsonb', nullable: true })
  social?: Record<string, string>;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  @Column({ type: 'int', default: 0, nullable: false })
  sortOrder: number;

  @ManyToOne(() => InvitationEntity, (i) => i.hosts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;
}
