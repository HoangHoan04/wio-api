import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('system-configs')
export class SystemConfigEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã định danh duy nhất cho cấu hình' })
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  code: string;

  @ApiProperty({ description: 'Tên hiển thị của cấu hình' })
  @Column({ type: 'varchar', length: 250, unique: true, nullable: false })
  name: string;

  @ApiProperty({ description: 'Loại: string | number | boolean | json' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  type: string;

  @ApiProperty({ description: 'Giá trị cấu hình dưới dạng JSON' })
  @Column({ type: 'jsonb', nullable: false })
  value: any;
}
