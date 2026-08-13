import { enumData } from '@/common/constanst/enumData';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('stock_assets')
@Index('IDX_stock_asset_kind_active', ['kind', 'isActive', 'sortOrder'])
export class StockAssetEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 150, nullable: false })
  @ApiProperty({ description: 'Tên hiển thị' })
  title: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  @Index()
  @ApiProperty({ description: 'Danh mục', enum: enumData.STOCK_ASSET_CATEGORY })
  category: string;

  @Column({ type: 'simple-array', nullable: true })
  @ApiProperty({ description: 'Từ khóa tìm kiếm', required: false })
  tags?: string[];

  @Column({ type: 'text', nullable: false })
  @ApiProperty({ description: 'URL PNG/WebP/JPEG (CORS)' })
  src: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Thumbnail, mặc định = src', required: false })
  thumb?: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: 'sticker' })
  @Index()
  @ApiProperty({ description: 'Loại asset', enum: enumData.STOCK_ASSET_KIND })
  kind: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  @ApiProperty({ description: 'Bản quyền / nguồn', required: false })
  license?: string;

  @Column({ type: 'int', default: 0, nullable: false })
  @ApiProperty({ description: 'Thứ tự hiển thị' })
  sortOrder: number;

  @Column({ type: 'boolean', default: true, nullable: false })
  @ApiProperty({ description: 'Đang hiện trên editor' })
  isActive: boolean;
}
