import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('action-logs')
@Index(['entityName', 'entityId'])
@Index(['createdById', 'createdAt'])
export class ActionLogEntity extends BaseEntity {
  @ApiProperty({ description: 'ID của user thực hiện hành động' })
  @Column({ type: 'uuid', nullable: false })
  createdById: string;

  @ApiProperty({ description: 'Mã code của user thực hiện hành động' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  createdByCode: string;

  @ApiProperty({ description: 'Tên của user thực hiện hành động' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  createdByName: string;

  @ApiPropertyOptional({ description: 'Ghi chú bổ sung về hành động' })
  @Column({ type: 'text', nullable: true })
  createdNote?: string;

  @ApiPropertyOptional({ description: 'Loại hành động' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  actionType?: string;

  @ApiPropertyOptional({ description: 'ID của thực thể bị tác động' })
  @Column({ type: 'uuid', nullable: true })
  entityId?: string;

  @ApiPropertyOptional({ description: 'Tên bảng / thực thể bị tác động' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  entityName?: string;

  @ApiPropertyOptional({ description: 'Giá trị cũ của thực thể (JSON)' })
  @Column({ type: 'jsonb', nullable: true })
  oldValue?: any;

  @ApiPropertyOptional({ description: 'Giá trị mới của thực thể (JSON)' })
  @Column({ type: 'jsonb', nullable: true })
  newValue?: any;

  @ApiPropertyOptional({
    description: 'Địa chỉ IP của người dùng thực hiện hành động',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'Chuỗi User-Agent của trình duyệt / thiết bị',
  })
  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Vị trí địa lý ước tính' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;
}
