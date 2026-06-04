import { ApiProperty } from '@nestjs/swagger';
import { Entity, Index, Column, ManyToOne, JoinColumn } from 'typeorm';
import { WeddingEntity } from './wedding.entity';
import { BaseEntity } from './base.entity';

// ==================== WISHES ====================
@Entity('wishes')
@Index(['weddingId', 'isApproved'])
export class WishEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID đám cưới' })
  weddingId: string;

  // Guest Id
  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'Guest Id' })
  guestId: string;

  // Guest Name
  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Guest Name' })
  guestName: string;

  // Content
  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'Content' })
  content: string;

  // Is Approved
  @Column({ type: 'boolean', default: true, nullable: false })
  @ApiProperty({ description: 'Is Approved' })
  isApproved: boolean;

  // Is Pinned
  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Is Pinned' })
  isPinned: boolean;

  // Approved At
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Approved At' })
  approvedAt: Date;

  // Wedding
  @ManyToOne(() => WeddingEntity, (wedding) => wedding.wishes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'weddingId' })
  @ApiProperty({ description: 'Wedding' })
  wedding: WeddingEntity;
}
