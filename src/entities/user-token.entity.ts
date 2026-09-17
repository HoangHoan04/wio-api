import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('user_tokens')
@Index(['userId', 'isRevoked'])
export class UserTokenEntity extends BaseEntity {
  @ApiPropertyOptional({ description: 'ID user sở hữu token' })
  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @ApiPropertyOptional({ description: 'Access token' })
  @Column({ type: 'text', nullable: true })
  accessToken?: string;

  @ApiPropertyOptional({ description: 'Refresh token' })
  @Column({ type: 'text', nullable: true })
  refreshToken?: string;

  @ApiPropertyOptional({ description: 'Địa chỉ IP đăng nhập' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'Chuỗi User-Agent của thiết bị' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Thời điểm hết hạn token' })
  @Column({ type: 'timestamptz', nullable: true })
  expiresAt?: Date;

  @ApiProperty({ description: 'Token đã bị thu hồi' })
  @Column({ type: 'boolean', default: false, nullable: false })
  isRevoked: boolean;
}
