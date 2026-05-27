import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from './enums';

// Tài khoản đăng nhập: cặp đôi hoặc admin hệ thống
@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty({ description: 'Địa chỉ email (Unique)' })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @ApiProperty({ description: 'Mật khẩu đã được hash' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  passwordHash: string;

  @ApiProperty({ description: 'Họ và tên' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  fullName: string;

  @ApiProperty({ description: 'Số điện thoại', required: false })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @ApiProperty({ description: 'Quyền: couple | admin', enum: UserRole })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.COUPLE,
    nullable: false,
  })
  role: UserRole;

  @ApiProperty({ description: 'Trạng thái hoạt động' })
  @Column({ type: 'boolean', default: true, nullable: false })
  isActive: boolean;
}
