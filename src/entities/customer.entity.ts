import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('customers')
export class CustomerEntity extends BaseEntity {
  @ApiProperty({ description: 'ID của user liên kết' })
  @Column({ type: 'varchar', length: 36, nullable: false })
  userId: string;

  @ApiProperty({ description: 'Mã khách hàng' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  code: string;

  @ApiProperty({ description: 'Họ và tên khách hàng' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  fullName: string;

  @ApiProperty({ description: 'Email khách hàng' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @ApiProperty({ description: 'Số điện thoại khách hàng' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @ApiProperty({ description: 'Giới tính' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  gender: string;

  @ApiProperty({ description: 'Ngày sinh' })
  @Column({ type: 'timestamptz', nullable: true })
  dateOfBirth: Date;
}
