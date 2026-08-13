import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity as TypeOrmBase,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity extends TypeOrmBase {
  @ApiProperty({ description: 'Id khóa chính' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  @ApiProperty({ description: 'Ngày tạo' })
  createdAt: Date;

  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'Người tạo, lưu user.id' })
  createdBy?: string;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  @ApiProperty({ description: 'Ngày sửa cuối' })
  updatedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  @ApiProperty({ description: 'Người sửa cuối, lưu user.id' })
  updatedBy?: string;

  @Column({ name: 'isDeleted', type: 'boolean', default: false })
  @ApiProperty({ description: 'Xóa mềm?' })
  isDeleted: boolean;
}
