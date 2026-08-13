import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('action-logs')
export class ActionLogEntity extends BaseEntity {
  @ApiProperty({ description: 'ID người dùng thực hiện hành động' })
  @Column({ type: 'uuid', nullable: false })
  createdById: string;

  @ApiProperty({ description: 'Mã người dùng thực hiện hành động' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  createdByCode: string;

  @ApiProperty({ description: 'Tên người dùng thực hiện hành động' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  createdByName: string;

  @ApiProperty({ description: 'Ghi chú bổ sung về hành động' })
  @Column({ type: 'text', nullable: true })
  createdNote?: string;

  @ApiProperty({ description: 'Loại hành động' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Action Type' })
  actionType?: string;

  @ApiProperty({ description: 'ID thực thể bị tác động' })
  @Column({ type: 'uuid', nullable: true })
  entityId?: string;

  @ApiProperty({ description: 'Tên bảng thực thể bị tác động' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  entityName?: string;

  @ApiProperty({ description: 'Lưu trữ giá trị cũ dưới dạng JSON' })
  @Column({ type: 'jsonb', nullable: true })
  oldValue?: any;

  @ApiProperty({ description: 'Lưu trữ giá trị mới dưới dạng JSON' })
  @Column({ type: 'jsonb', nullable: true })
  newValue?: any;

  @ApiProperty({ description: 'Địa chỉ IP của người dùng' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  ipAddress?: string;

  @ApiProperty({ description: 'User agent string của trình duyệt' })
  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @ApiProperty({ description: 'Vị trí địa lý ước tính' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;
}
