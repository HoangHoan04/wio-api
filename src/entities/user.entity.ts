import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { enumData } from '@/common/constanst/enumData';
import { BaseEntity } from './base.entity';
import { CustomerEntity } from './customer.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ description: 'Mật khẩu đã mã hóa' })
  password: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @ApiProperty({ description: 'Địa chỉ email (Dùng để đăng nhập)' })
  email: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: 'Tài khoản có là admin không' })
  isAdmin: boolean;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Refresh token đã mã hóa' })
  refreshToken?: string;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Lần đăng nhập gần nhất' })
  lastLogin?: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Số điện thoại', required: false })
  phone?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Quyền', enum: enumData.USER_ROLE })
  role?: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  @ApiProperty({ description: 'Trạng thái hoạt động' })
  isActive: boolean;

  @OneToOne(() => CustomerEntity, (customer) => customer.user, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ description: 'Customer' })
  customer: Promise<CustomerEntity>;

  @OneToMany(() => InvitationEntity, (invitation) => invitation.user)
  @ApiProperty({ description: 'Invitations' })
  invitations: InvitationEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  syncAdminFlag() {
    if (this.role === enumData.USER_ROLE.ADMIN.code) {
      this.isAdmin = true;
    } else if (this.role === enumData.USER_ROLE.CUSTOMER.code) {
      this.isAdmin = false;
    }
  }

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password && this.password.length < 60) {
      this.password = await bcrypt.hash(this.password, 10);
    }
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
