import { enumData } from '@/common/constanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('invitation_hosts')
export class InvitationHostEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID thiệp' })
  invitationId: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  @ApiProperty({ description: 'Vai trò', enum: enumData.HOST_ROLE })
  role: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  @ApiProperty({ description: 'Họ tên' })
  fullName: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  @ApiProperty({ description: 'Tên ngắn', required: false })
  shortName?: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  @ApiProperty({ description: 'Danh xưng', required: false })
  honorific?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Ảnh', required: false })
  photoUrl?: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty({ description: 'Ngày sinh', required: false })
  dob?: Date;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Tiểu sử', required: false })
  bio?: string;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Gia đình', required: false })
  family?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ description: 'Thuộc tính theo loại thiệp', required: false })
  extra?: Record<string, any>;

  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({ description: 'Thứ tự' })
  sortOrder: number;

  @ManyToOne(() => InvitationEntity, (invitation) => invitation.hosts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;
}
