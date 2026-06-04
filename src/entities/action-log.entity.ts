import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('action-logs')
export class ActionLogEntity extends BaseEntity {
  // Created By Id
  @ApiProperty({ description: 'ID người dùng thực hiện hành động' })
  @Column({ type: 'uuid', nullable: false })
  createdById: string;

  // Created By Code
  @ApiProperty({ description: 'Mã người dùng thực hiện hành động' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  createdByCode: string;

  // Created By Name
  @ApiProperty({ description: 'Tên người dùng thực hiện hành động' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  createdByName: string;

  // Created Note
  @ApiProperty({ description: 'Ghi chú bổ sung về hành động' })
  @Column({ type: 'text', nullable: true })
  createdNote?: string;

  @ApiProperty({
    description: 'Loại hành động: Login | CreateExam | SubmitExam...',
  })
  // Action Type
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Action Type' })
  actionType?: string;

  // ID thực thể
  @ApiProperty({ description: 'ID thực thể bị tác động' })
  @Column({ type: 'uuid', nullable: true })
  entityId?: string;

  // Entity Name
  @ApiProperty({ description: 'Tên bảng thực thể bị tác động' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  entityName?: string;

  // Old Value
  @ApiProperty({ description: 'Lưu trữ giá trị cũ dưới dạng JSON' })
  @Column({ type: 'jsonb', nullable: true })
  oldValue?: any;

  // New Value
  @ApiProperty({ description: 'Lưu trữ giá trị mới dưới dạng JSON' })
  @Column({ type: 'jsonb', nullable: true })
  newValue?: any;

  // Địa chỉ IP
  @ApiProperty({ description: 'Địa chỉ IP của người dùng' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  ipAddress?: string;

  // User Agent
  @ApiProperty({ description: 'User agent string của trình duyệt' })
  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  // Location
  @ApiProperty({ description: 'Vị trí địa lý ước tính' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;
}
