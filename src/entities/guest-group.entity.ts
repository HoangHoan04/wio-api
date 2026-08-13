import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GuestEntity } from './guest.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('guest_groups')
@Index(['invitationId', 'code'], { unique: true, where: `"isDeleted" = false` })
export class GuestGroupEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID thiệp' })
  invitationId: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  @ApiProperty({ description: 'Mã nhóm' })
  code: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  @ApiProperty({ description: 'Tên nhóm' })
  name: string;

  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({ description: 'Thứ tự' })
  sortOrder: number;

  @ManyToOne(() => InvitationEntity, (invitation) => invitation.guestGroups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;

  @OneToMany(() => GuestEntity, (guest) => guest.group)
  guests: GuestEntity[];
}
