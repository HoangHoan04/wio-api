import { enumData } from '@/common/constanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('service_plans')
@Index(['isActive'])
export class ServicePlanEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên gói dịch vụ' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @ApiProperty({
    description: 'Mã gói dịch vụ',
    enum: enumData.SERVICE_PLAN_CODE,
  })
  @Column({ type: 'varchar', length: 20, nullable: false })
  code: string;

  @ApiProperty({ description: 'Số thiệp tối đa được tạo' })
  @Column({ type: 'int', nullable: false, default: 1 })
  maxInvitations: number;

  @ApiProperty({ description: 'Số khách mời tối đa' })
  @Column({ type: 'int', nullable: false })
  maxGuests: number;

  @ApiProperty({ description: 'Số ảnh tối đa' })
  @Column({ type: 'int', nullable: false })
  maxPhotos: number;

  @ApiProperty({ description: 'Có sử dụng tính năng AI không' })
  @Column({ type: 'boolean', default: false, nullable: false })
  hasAi: boolean;

  @ApiProperty({ description: 'Có phân tích dữ liệu không' })
  @Column({ type: 'boolean', default: false, nullable: false })
  hasAnalytics: boolean;

  @ApiProperty({ description: 'Có cho phép custom slug không' })
  @Column({ type: 'boolean', default: false, nullable: false })
  hasCustomSlug: boolean;

  @ApiProperty({ description: 'Có cho phép tự thiết kế (Canva) không' })
  @Column({ type: 'boolean', default: false, nullable: false })
  hasCustomDesign: boolean;

  @ApiProperty({ description: 'Số lần AI scan tối đa' })
  @Column({ type: 'int', default: 0, nullable: false })
  maxAiScans: number;

  @ApiProperty({ description: 'Số trang canvas tối đa' })
  @Column({ type: 'int', default: 1, nullable: false })
  maxCanvasPages: number;

  @ApiProperty({ description: 'Số ngày hiệu lực của gói' })
  @Column({ type: 'int', nullable: false })
  durationDays: number;

  @ApiProperty({ description: 'Giá gói (VND)' })
  @Column({
    type: 'bigint',
    nullable: false,
    transformer: {
      to: (v: number) => v,
      from: (v: string) => Number(v),
    },
  })
  priceVnd: number;

  @ApiProperty({ description: 'Trạng thái hoạt động' })
  @Column({ type: 'boolean', default: true, nullable: false })
  isActive: boolean;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  @Column({ type: 'int', default: 0, nullable: false })
  sortOrder: number;
}
