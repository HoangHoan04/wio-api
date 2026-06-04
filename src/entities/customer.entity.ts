import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

// ==================== CUSTOMERS ====================
@Entity('customers')
export class CustomerEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false })
  @ApiProperty({ description: 'ID của user liên kết' })
  userId: string;

  // Mã
  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Mã khách hàng' })
  code: string;

  // Họ và tên
  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Họ và tên khách hàng' })
  fullName: string;

  // Email
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Email khách hàng' })
  email: string;

  // Số điện thoại
  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Số điện thoại khách hàng' })
  phone: string;

  // Giới tính
  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Giới tính' })
  gender: string;

  // Ngày sinh
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày sinh' })
  dateOfBirth: Date;

  // User
  @OneToOne(() => UserEntity, (user) => user.customer)
  @ApiProperty({ description: 'User' })
  user: Promise<UserEntity>;
}
