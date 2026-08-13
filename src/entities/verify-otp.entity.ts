import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('verify_otps')
export class VerifyOtpEntity extends BaseEntity {
  @ApiProperty({ description: 'Định danh (Email hoặc Số điện thoại)' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  identifier: string;

  @ApiProperty({ description: 'Mã OTP 6 số' })
  @Column({ type: 'varchar', length: 10, nullable: false })
  otpCode: string;

  @ApiProperty({ description: 'Phương thức gửi (EMAIL/SMS)' })
  @Column({ type: 'varchar', length: 20, nullable: false })
  method: string;

  @ApiProperty({ description: 'Thời gian hết hạn của OTP' })
  @Column({ type: 'timestamptz', nullable: false })
  expiresAt: Date;

  @ApiProperty({ description: 'Trạng thái đã được xác thực hay chưa' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isVerified: boolean;
}
