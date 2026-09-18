import { IdDto, PaginationDto, UserDto } from '@/dto';
import { StockAssetEntity } from '@/entities';
import { StockAssetRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateStockAssetDto,
  FilterStockAssetDto,
  PublicStockAssetListDto,
  UpdateStockAssetDto,
} from './dto';

@Injectable()
export class StockAssetService {
  constructor(private readonly repo: StockAssetRepository) {}

  /* ============================================================
   * PUBLIC — Danh sách cho editor
   * ============================================================ */
  async listPublic(query: PublicStockAssetListDto = {}) {
    const take = query.take ?? 24;
    const skip = query.skip ?? 0;

    const baseWhere: FindOptionsWhere<StockAssetEntity> = {
      isDeleted: false,
      isActive: true,
    };

    if (query.category) baseWhere.category = query.category;
    if (query.kind) baseWhere.kind = query.kind;

    const q = query.q?.trim();
    const where: FindOptionsWhere<StockAssetEntity> = q
      ? { ...baseWhere, title: ILike(`%${q}%`) }
      : baseWhere;

    const [list, total] = await this.repo.findAndCount({
      where,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
      skip,
      take,
      select: {
        id: true,
        title: true,
        category: true,
        tags: true,
        src: true,
        thumb: true,
        kind: true,
        license: true,
      },
    });

    // Fallback: nếu không có thumb → dùng src
    const data = list.map((item) => ({
      ...item,
      thumb: item.thumb || item.src,
      tags: item.tags || [],
      license: item.license || '',
    }));

    return { message: 'Thành công', data, total };
  }

  /* ============================================================
   * ADMIN — Pagination
   * ============================================================ */
  async pagination(data: PaginationDto<FilterStockAssetDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<StockAssetEntity> = { isDeleted: false };

    if (where.title) whereCon.title = ILike(`%${where.title}%`);
    if (where.category) whereCon.category = where.category;
    if (where.kind) whereCon.kind = where.kind;
    if (where.isActive !== undefined) whereCon.isActive = where.isActive;

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  /* ============================================================
   * ADMIN — Find by id
   * ============================================================ */
  async findById(data: IdDto) {
    const item = await this.requireOne(data.id);
    return { message: 'Thành công', data: item };
  }

  /* ============================================================
   * ADMIN — Create
   * ============================================================ */
  async create(user: UserDto, dto: CreateStockAssetDto) {
    const entity = this.repo.create({
      id: uuidv4(),
      title: dto.title.trim(),
      category: dto.category,
      kind: dto.kind,
      tags: dto.tags ?? [],
      src: dto.src.trim(),
      thumb: dto.thumb?.trim() || dto.src.trim(),
      width: dto.width,
      height: dto.height,
      mimeType: dto.mimeType,
      isPremium: dto.isPremium ?? false,
      license: dto.license?.trim(),
      sortOrder: dto.sortOrder ?? 0,
      isActive: dto.isActive ?? true,
      createdBy: user.id,
    });

    const saved = await this.repo.save(entity);
    return { message: 'Tạo asset thành công', data: saved };
  }

  /* ============================================================
   * ADMIN — Update
   * ============================================================ */
  async update(dto: UpdateStockAssetDto, user: UserDto) {
    const entity = await this.requireOne(dto.id);

    if (dto.title !== undefined) entity.title = dto.title.trim();
    if (dto.category !== undefined) entity.category = dto.category;
    if (dto.kind !== undefined) entity.kind = dto.kind;
    if (dto.tags !== undefined) entity.tags = dto.tags;
    if (dto.src !== undefined) entity.src = dto.src.trim();
    if (dto.thumb !== undefined) {
      entity.thumb = dto.thumb?.trim() || entity.src;
    }
    if (dto.width !== undefined) entity.width = dto.width;
    if (dto.height !== undefined) entity.height = dto.height;
    if (dto.mimeType !== undefined) entity.mimeType = dto.mimeType;
    if (dto.isPremium !== undefined) entity.isPremium = dto.isPremium;
    if (dto.license !== undefined) {
      entity.license = dto.license?.trim() || undefined;
    }
    if (dto.sortOrder !== undefined) entity.sortOrder = dto.sortOrder;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;

    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật asset thành công', data: saved };
  }

  /* ============================================================
   * ADMIN — Delete (soft)
   * ============================================================ */
  async delete(data: IdDto, user: UserDto) {
    const entity = await this.requireOne(data.id);
    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xoá asset thành công' };
  }

  /* ============================================================
   * PRIVATE
   * ============================================================ */
  private async requireOne(id: string) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy asset');
    return entity;
  }
}
