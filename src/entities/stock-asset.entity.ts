import { enumData } from '@/common/constanst/enumData';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('stock_assets')
@Index('IDX_stock_asset_kind_active', ['kind', 'isActive', 'sortOrder'])
export class StockAssetEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên hiển thị của asset' })
  @Column({ type: 'varchar', length: 150, nullable: false })
  title: string;

  @ApiProperty({
    description: 'Danh mục asset',
    enum: enumData.STOCK_ASSET_CATEGORY,
  })
  @Index()
  @Column({ type: 'varchar', length: 40, nullable: false })
  category: string;

  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm', type: [String] })
  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @ApiProperty({ description: 'URL file asset (PNG/WebP/JPEG)' })
  @Column({ type: 'text', nullable: false })
  src: string;

  @ApiPropertyOptional({ description: 'URL ảnh thumbnail (mặc định = src)' })
  @Column({ type: 'text', nullable: true })
  thumb?: string;

  @ApiProperty({ description: 'Loại asset', enum: enumData.STOCK_ASSET_KIND })
  @Index()
  @Column({ type: 'varchar', length: 20, nullable: false })
  kind: string;

  @ApiPropertyOptional({ description: 'Bản quyền / nguồn của asset' })
  @Column({ type: 'varchar', length: 120, nullable: true })
  license?: string;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  @Column({ type: 'int', default: 0, nullable: false })
  sortOrder: number;

  @ApiProperty({ description: 'Đang hiển thị trên editor' })
  @Column({ type: 'boolean', default: true, nullable: false })
  isActive: boolean;
}
