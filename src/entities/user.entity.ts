import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { CustomerEntity } from './customer.entity';
import { WeddingEntity } from './wedding.entity';
import { UserRole } from './enums';

@Entity('users')
export class UserEntity extends BaseEntity {
  // Password
  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Mật khẩu đã mã hóa' })
  password: string;

  // Email
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @ApiProperty({ description: 'Địa chỉ email (Dùng để đăng nhập)' })
  email: string;

  // Customer Id
  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'Mã khách hàng (nếu user là khách hàng)' })
  customerId: string;

  // Is Admin
  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: 'Tài khoản có là admin không' })
  isAdmin: boolean;

  // Refresh Token
  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Refresh token đã mã hóa' })
  refreshToken: string;

  // Last Login
  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Lần đăng nhập gần nhất' })
  lastLogin: Date;

  // Số điện thoại
  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Số điện thoại', required: false })
  phone: string;

  // Vai trò
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.COUPLE,
    nullable: false,
  })
  @ApiProperty({ description: 'Quyền: couple | admin', enum: UserRole })
  role: UserRole;

  // Is Active
  @Column({ type: 'boolean', default: true, nullable: false })
  @ApiProperty({ description: 'Trạng thái hoạt động' })
  isActive: boolean;

  // Setup Mối quan hệ vật lý
  @OneToOne(() => CustomerEntity, (customer) => customer.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  @ApiProperty({ description: 'Customer' })
  customer: Promise<CustomerEntity>;

  // Weddings
  @OneToMany(() => WeddingEntity, (wedding) => wedding.user)
  @ApiProperty({ description: 'Weddings' })
  weddings: WeddingEntity[];

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.password && this.password.length < 60) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
