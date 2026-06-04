import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('user_tokens')
export class UserTokenEntity extends BaseEntity {
  // ID người dùng
  @ApiProperty({ description: 'ID của user liên kết' })
  @Column({ type: 'uuid', nullable: true })
  userId: string;

  // Access Token
  @ApiProperty({ description: 'Access Token' })
  @Column({ type: 'text', nullable: true })
  accessToken: string;

  // Refresh Token
  @ApiProperty({ description: 'Refresh Token' })
  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  // Địa chỉ IP
  @ApiProperty({ description: 'Địa chỉ IP đăng nhập' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress: string;

  // User Agent
  @ApiProperty({ description: 'Thiết bị đăng nhập' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent: string;

  // Ngày hết hạn
  @ApiProperty({ description: 'Thời gian hết hạn' })
  @Column({ type: 'timestamptz', nullable: true })
  expiresAt: Date;

  // Is Revoked
  @ApiProperty({ description: 'Trạng thái thu hồi token' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isRevoked: boolean;
}
