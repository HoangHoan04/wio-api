import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('customers')
export class CustomerEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false, unique: true })
  @ApiProperty({ description: 'ID của user liên kết' })
  userId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Mã khách hàng' })
  code?: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Họ và tên khách hàng' })
  fullName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Email khách hàng' })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Số điện thoại khách hàng' })
  phone?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Giới tính' })
  gender?: string;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày sinh' })
  dateOfBirth?: Date;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Ảnh đại diện', required: false })
  avatarUrl?: string;

  @OneToOne(() => UserEntity, (user) => user.customer)
  @JoinColumn({ name: 'userId' })
  @ApiProperty({ description: 'User' })
  user: Promise<UserEntity>;
}
