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

@Entity('tables')
@Index(['invitationId', 'name'])
export class TableEntity extends BaseEntity {
  @ApiProperty({ description: 'ID thiệp cưới' })
  @Column({ type: 'uuid', nullable: false })
  invitationId: string;

  @ApiProperty({ description: 'Tên bàn tiệc' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({ description: 'Số ghế tối đa' })
  @Column({ type: 'smallint', default: 10, nullable: false })
  maxSeats: number;

  @ApiProperty({ description: 'Số ghế hiện tại đã có khách' })
  @Column({ type: 'smallint', default: 0, nullable: false })
  currentSeats: number;

  @ApiPropertyOptional({ description: 'Mô tả bàn tiệc' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @ApiPropertyOptional({ description: 'Vị trí X trên sơ đồ' })
  @Column({ type: 'int', nullable: true })
  positionX?: number;

  @ApiPropertyOptional({ description: 'Vị trí Y trên sơ đồ' })
  @Column({ type: 'int', nullable: true })
  positionY?: number;

  @ApiPropertyOptional({ description: 'Hình dạng bàn', enum: enumData.TABLE_SHAPE })
  @Column({ type: 'varchar', length: 20, nullable: true })
  shape?: string;

  @ManyToOne(() => InvitationEntity, (i) => i.tables, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitationId' })
  invitation: InvitationEntity;

  @OneToMany(() => GuestEntity, (g) => g.table)
  guests: GuestEntity[];
}
