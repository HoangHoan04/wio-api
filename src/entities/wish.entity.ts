import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WeddingEntity } from './wedding.entity';

@Entity('wishes')
@Index(['weddingId', 'isApproved'])
export class WishEntity extends BaseEntity {
  /** Id đám cưới */
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID đám cưới' })
  weddingId: string;

  // Id khách mời
  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'Guest Id' })
  guestId?: string;

  // Tên khách mời
  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Guest Name' })
  guestName: string;

  // Nội dung lời chúc
  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'Content' })
  content: string;

  // Có được duyệt hay không
  @Column({ type: 'boolean', default: true, nullable: false })
  @ApiProperty({ description: 'Is Approved' })
  isApproved: boolean;

  // Có được ghim hay không
  @Column({ type: 'boolean', default: false, nullable: false })
  @ApiProperty({ description: 'Is Pinned' })
  isPinned: boolean;

  // Ngày được duyệt
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Approved At' })
  approvedAt?: Date;

  // Id người duyệt
  @ManyToOne(() => WeddingEntity, (wedding) => wedding.wishes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'weddingId' })
  @ApiProperty({ description: 'Wedding' })
  wedding: WeddingEntity;
}
