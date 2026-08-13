import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GuestEntity } from './guest.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('tables')
export class TableEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID thiệp' })
  invitationId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @ApiProperty({ description: 'Tên bàn' })
  name: string;

  @Column({ type: 'smallint', default: 10, nullable: false })
  @ApiProperty({ description: 'Số lượng ghế tối đa' })
  maxSeats: number;

  @Column({ type: 'smallint', default: 0, nullable: true })
  @ApiProperty({ description: 'Số ghế hiện tại' })
  currentSeats?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Mô tả', required: false })
  description?: string;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ description: 'Vị trí X', required: false })
  positionX?: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ description: 'Vị trí Y', required: false })
  positionY?: number;

  @ManyToOne(() => InvitationEntity, (invitation) => invitation.tables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;

  @OneToMany(() => GuestEntity, (guest) => guest.table)
  guests: GuestEntity[];
}
