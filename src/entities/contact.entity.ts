import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('contacts')
@Index(['status', 'createdAt'])
export class ContactEntity extends BaseEntity {
  @ApiPropertyOptional({ description: 'Mã liên hệ' })
  @Column({ name: 'code', type: 'varchar', length: 50, nullable: true })
  code?: string;

  @ApiProperty({ description: 'Tên người liên hệ' })
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Email người liên hệ' })
  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @ApiPropertyOptional({ description: 'Số điện thoại người liên hệ' })
  @Column({ name: 'phone', type: 'varchar', length: 50, nullable: true })
  phone?: string;

  @ApiPropertyOptional({ description: 'Tiêu đề liên hệ' })
  @Column({ name: 'subject', type: 'varchar', length: 255, nullable: true })
  subject?: string;

  @ApiProperty({ description: 'Nội dung tin nhắn' })
  @Column({ name: 'message', type: 'text' })
  message: string;

  @ApiProperty({
    description: 'Trạng thái xử lý',
    enum: enumData.CONTACT_STATUS,
  })
  @Column({ name: 'status', type: 'varchar', length: 20 })
  status: string;

  @ApiPropertyOptional({ description: 'Ghi chú của admin' })
  @Column({ name: 'admin_note', type: 'text', nullable: true })
  adminNote?: string;

  @ApiPropertyOptional({ description: 'Thời điểm phản hồi' })
  @Column({ name: 'responded_at', type: 'timestamptz', nullable: true })
  respondedAt?: Date;

  @ApiPropertyOptional({ description: 'ID admin phản hồi' })
  @Column({ name: 'responded_by', type: 'uuid', nullable: true })
  respondedBy?: string;
}
