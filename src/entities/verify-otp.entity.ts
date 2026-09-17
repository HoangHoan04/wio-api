import { enumData } from '@/common/constanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('verify_otps')
@Index(['identifier', 'otpCode'])
export class VerifyOtpEntity extends BaseEntity {
  @ApiProperty({ description: 'Định danh nhận OTP (email hoặc số điện thoại)' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  identifier: string;

  @ApiProperty({ description: 'Mã OTP' })
  @Column({ type: 'varchar', length: 10, nullable: false })
  otpCode: string;

  @ApiProperty({
    description: 'Phương thức gửi OTP',
    enum: enumData.OTP_METHOD,
  })
  @Column({ type: 'varchar', length: 20, nullable: false })
  method: string;

  @ApiProperty({ description: 'Thời điểm hết hạn OTP' })
  @Column({ type: 'timestamptz', nullable: false })
  expiresAt: Date;

  @ApiProperty({ description: 'OTP đã được xác thực' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isVerified: boolean;
}
