import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('user_tokens')
export class UserTokenEntity extends BaseEntity {
  @ApiProperty({ description: 'ID của user liên kết' })
  @Column({ type: 'varchar', length: 36, nullable: false })
  userId: string;

  @ApiProperty({ description: 'Access Token' })
  @Column({ type: 'text', nullable: true })
  accessToken: string;

  @ApiProperty({ description: 'Refresh Token' })
  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @ApiProperty({ description: 'Địa chỉ IP đăng nhập' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress: string;

  @ApiProperty({ description: 'Thiết bị đăng nhập' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent: string;

  @ApiProperty({ description: 'Thời gian hết hạn' })
  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date;

  @ApiProperty({ description: 'Trạng thái thu hồi token' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isRevoked: boolean;
}
