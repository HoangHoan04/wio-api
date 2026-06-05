import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GuestEntity } from './guest.entity';
import { WeddingEntity } from './wedding.entity';

@Entity('tables')
export class TableEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID đám cưới' })
  weddingId: string;

  // Tên
  @Column({ type: 'varchar', length: 50, nullable: false })
  @ApiProperty({ description: 'Tên' })
  name: string;

  // Max Seats
  @Column({ type: 'smallint', default: 10, nullable: false })
  @ApiProperty({ description: 'Max Seats' })
  maxSeats: number;

  // Current Seats
  @Column({ type: 'smallint', default: 0, nullable: false })
  @ApiProperty({ description: 'Current Seats' })
  currentSeats: number;

  // Mô tả
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Mô tả' })
  description: string;

  // Position X
  @Column({ type: 'int', nullable: true })
  @ApiProperty({ description: 'Position X' })
  positionX: number;

  // Position Y
  @Column({ type: 'int', nullable: true })
  @ApiProperty({ description: 'Position Y' })
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
