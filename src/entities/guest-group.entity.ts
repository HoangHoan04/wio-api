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
import { GuestEntity } from './guest.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('guest_groups')
@Index(['invitationId', 'code'], { unique: true, where: `"isDeleted" = false` })
export class GuestGroupEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @Column({ type: 'uuid', nullable: false })
  invitationId: string;

  @ApiProperty({ description: 'Mã nhóm khách' })
  @Column({ type: 'varchar', length: 40, nullable: false })
  code: string;

  @ApiProperty({ description: 'Tên nhóm khách' })
  @Column({ type: 'varchar', length: 80, nullable: false })
  name: string;

  @ApiPropertyOptional({
    description: 'Bên của nhóm khách',
    enum: enumData.GUEST_SIDE,
  })
  @Column({ type: 'varchar', length: 20, nullable: true })
  side?: string;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  @Column({ type: 'int', default: 0, nullable: false })
  sortOrder: number;

  @ManyToOne(() => InvitationEntity, (i) => i.guestGroups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;

  @OneToMany(() => GuestEntity, (g) => g.group)
  guests: GuestEntity[];
}
