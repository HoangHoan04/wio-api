import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('contacts')
export class ContactEntity extends BaseEntity {
  @Column({ name: 'code', type: 'varchar', length: 50, nullable: true })
  code: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'phone', type: 'varchar', length: 50, nullable: true })
  phone: string;

  @Column({ name: 'subject', type: 'varchar', length: 255, nullable: true })
  subject: string;

  @Column({ name: 'message', type: 'text' })
  message: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 50,
    default: 'PENDING',
  })
  status: string;

  @Column({ name: 'admin_note', type: 'text', nullable: true })
  adminNote: string;

  @Column({ name: 'responded_at', type: 'timestamp', nullable: true })
  respondedAt: Date;

  @Column({ name: 'responded_by', type: 'varchar', length: 36, nullable: true })
  respondedBy: string;

  @Column({ name: 'created_by_id', type: 'varchar', length: 36, nullable: true })
  createdById: string;
}
