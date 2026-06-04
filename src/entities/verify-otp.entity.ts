import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('verify_otps')
export class VerifyOtpEntity extends BaseEntity {
  // Identifier
  @ApiProperty({ description: 'Định danh (Email hoặc Số điện thoại)' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  identifier: string;

  // Mã OTP
  @ApiProperty({ description: 'Mã OTP 6 số' })
  @Column({ type: 'varchar', length: 10, nullable: false })
  otpCode: string;

  // Method
  @ApiProperty({ description: 'Phương thức gửi (EMAIL/SMS)' })
  @Column({ type: 'varchar', length: 20, nullable: false })
  method: string;

  // Ngày hết hạn
  @ApiProperty({ description: 'Thời gian hết hạn của OTP' })
  @Column({ type: 'timestamptz', nullable: false })
  expiresAt: Date;

  // Is Verified
  @ApiProperty({ description: 'Trạng thái đã được xác thực hay chưa' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isVerified: boolean;
}
