import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GuestEntity } from './guest.entity';
import { WeddingEntity } from './wedding.entity';

@Entity('tables')
export class TableEntity extends BaseEntity {
  // ID đám cưới
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID đám cưới' })
  weddingId: string;

  // Tên bàn
  @Column({ type: 'varchar', length: 50, nullable: false })
  @ApiProperty({ description: 'Tên' })
  name: string;

  // Số lượng ghế tối đa
  @Column({ type: 'smallint', default: 10, nullable: false })
  @ApiProperty({ description: 'Số lượng ghế tối đa' })
  maxSeats: number;

  // Số ghế hiện tại
  @Column({ type: 'smallint', default: 0, nullable: false })
  @ApiProperty({ description: 'Số ghế hiện tại' })
  currentSeats: number;

  // Mô tả
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Mô tả' })
  description: string;

  // Position X
  @Column({ type: 'int', nullable: true })
  @ApiProperty({ description: 'Vị trí X' })
  positionX: number;

  // Position Y
  @Column({ type: 'int', nullable: true })
  @ApiProperty({ description: 'Vị trí Y' })
  positionY: number;

  // Wedding
  @ManyToOne(() => WeddingEntity, (wedding) => wedding.tables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'weddingId' })
  @ApiProperty({ description: 'Wedding' })
  wedding: WeddingEntity;

  // Guests
  @OneToMany(() => GuestEntity, (guest) => guest.table)
  @ApiProperty({ description: 'Guests' })
  guests: GuestEntity[];
}
