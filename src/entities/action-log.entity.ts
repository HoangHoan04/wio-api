import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('action-logs')
export class ActionLogEntity extends BaseEntity {
  // Id người dùng thực hiện hành động
  @ApiProperty({ description: 'ID người dùng thực hiện hành động' })
  @Column({ type: 'uuid', nullable: false })
  createdById: string;

  // Mã người dùng thực hiện hành động
  @ApiProperty({ description: 'Mã người dùng thực hiện hành động' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  createdByCode: string;

  // Tên người dùng thực hiện hành động
  @ApiProperty({ description: 'Tên người dùng thực hiện hành động' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  createdByName: string;

  // Ghi chú bổ sung về hành động
  @ApiProperty({ description: 'Ghi chú bổ sung về hành động' })
  @Column({ type: 'text', nullable: true })
  createdNote?: string;

  // Loại hành động
  @ApiProperty({ description: 'Loại hành động' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Action Type' })
  actionType?: string;

  // ID thực thể
  @ApiProperty({ description: 'ID thực thể bị tác động' })
  @Column({ type: 'uuid', nullable: true })
  entityId?: string;

  // Tên thực thể
  @ApiProperty({ description: 'Tên bảng thực thể bị tác động' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  entityName?: string;

  // Giá trị cũ
  @ApiProperty({ description: 'Lưu trữ giá trị cũ dưới dạng JSON' })
  @Column({ type: 'jsonb', nullable: true })
  oldValue?: any;

  // Giá trị mới
  @ApiProperty({ description: 'Lưu trữ giá trị mới dưới dạng JSON' })
  @Column({ type: 'jsonb', nullable: true })
  newValue?: any;

  // Địa chỉ IP
  @ApiProperty({ description: 'Địa chỉ IP của người dùng' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  ipAddress?: string;

  // User agent
  @ApiProperty({ description: 'User agent string của trình duyệt' })
  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  // Location
  @ApiProperty({ description: 'Vị trí địa lý ước tính' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;
}
