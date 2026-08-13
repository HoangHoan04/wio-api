import { enumData } from '@/common/constanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('invitation_events')
export class InvitationEventEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID thiệp' })
  invitationId: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  @ApiProperty({ description: 'Loại sự kiện', enum: enumData.EVENT_KEY })
  eventKey: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Tiêu đề' })
  title: string;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Thời gian bắt đầu', required: false })
  startsAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Địa điểm', required: false })
  venue?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Địa chỉ', required: false })
  address?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Link bản đồ', required: false })
  mapsUrl?: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @ApiProperty({ description: 'Vĩ độ', required: false })
  lat?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  @ApiProperty({ description: 'Kinh độ', required: false })
  lng?: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Dress code', required: false })
  dressCode?: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Sự kiện chính (countdown)' })
  isPrimary: boolean;

  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({ description: 'Thứ tự' })
  sortOrder: number;

  @ManyToOne(() => InvitationEntity, (invitation) => invitation.events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;
}
