import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('customers')
export class CustomerEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: false, unique: true })
  @ApiProperty({ description: 'ID user liên kết' })
  userId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Mã khách hàng' })
  code?: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  @ApiProperty({ description: 'Họ và tên' })
  fullName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Email' })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Số điện thoại' })
  phone?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  @ApiProperty({ description: 'Giới tính' })
  gender?: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty({ description: 'Ngày sinh' })
  dateOfBirth?: Date;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Ảnh đại diện' })
  avatarUrl?: string;

  @OneToOne(() => UserEntity, (u) => u.customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
