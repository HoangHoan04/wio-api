import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationTimelineEntity } from './invitation-timeline.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('invitation_events')
@Index(['invitationId', 'isPrimary'])
export class InvitationEventEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @Column({ type: 'uuid', nullable: false })
  invitationId: string;

  @ApiProperty({ description: 'Loại sự kiện cưới', enum: enumData.EVENT_KEY })
  @Column({ type: 'varchar', length: 40, nullable: false })
  eventKey: string;

  @ApiProperty({ description: 'Tiêu đề sự kiện' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @ApiPropertyOptional({ description: 'Thời gian bắt đầu' })
  @Column({ type: 'timestamptz', nullable: true })
  startsAt?: Date;

  @ApiPropertyOptional({ description: 'Thời gian kết thúc' })
  @Column({ type: 'timestamptz', nullable: true })
  endsAt?: Date;

  @ApiPropertyOptional({ description: 'Tên địa điểm' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  venue?: string;

  @ApiPropertyOptional({ description: 'Địa chỉ chi tiết' })
  @Column({ type: 'text', nullable: true })
  address?: string;

  @ApiPropertyOptional({ description: 'Link Google Maps' })
  @Column({ type: 'text', nullable: true })
  mapsUrl?: string;

  @ApiPropertyOptional({ description: 'Vĩ độ' })
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat?: number;

  @ApiPropertyOptional({ description: 'Kinh độ' })
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lng?: number;

  @ApiPropertyOptional({ description: 'Trang phục gợi ý' })
  @Column({ type: 'text', nullable: true })
  dressCode?: string;

  @ApiProperty({ description: 'Là sự kiện chính (dùng cho countdown)' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isPrimary: boolean;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  @Column({ type: 'int', default: 0, nullable: false })
  sortOrder: number;

  @ManyToOne(() => InvitationEntity, (i) => i.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;

  @OneToMany(() => InvitationTimelineEntity, (t) => t.event)
  timelines: InvitationTimelineEntity[];
}
