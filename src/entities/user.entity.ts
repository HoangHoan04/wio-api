import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { CustomerEntity } from './customer.entity';
import { InvitationEntity } from './invitation.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty({ description: 'Mật khẩu đã mã hóa' })
  @Column({ type: 'varchar', length: 255, nullable: false, select: false })
  password: string;

  @ApiProperty({ description: 'Email đăng nhập' })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @ApiProperty({ description: 'Quyền của user', enum: enumData.USER_ROLE })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: enumData.USER_ROLE.CUSTOMER.code,
  })
  role: string;

  @ApiProperty({ description: 'Trạng thái hoạt động' })
  @Column({ type: 'boolean', default: true, nullable: false })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Thời điểm đăng nhập gần nhất' })
  @Column({ type: 'timestamptz', nullable: true })
  lastLogin?: Date;

  @ApiPropertyOptional({ description: 'Refresh token đã mã hóa' })
  @Column({ type: 'text', nullable: true, select: false })
  refreshToken?: string;

  @OneToOne(() => CustomerEntity, (c) => c.user)
  customer: Promise<CustomerEntity>;

  @OneToMany(() => InvitationEntity, (i) => i.user)
  invitations: InvitationEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && this.password.length < 60) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.password);
  }
}
