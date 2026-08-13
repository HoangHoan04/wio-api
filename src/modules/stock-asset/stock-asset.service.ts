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

  async listPublic(query: PublicStockAssetListDto = {}) {
    const take = query.take ?? 24;
    const skip = query.skip ?? 0;
    const baseWhere: FindOptionsWhere<StockAssetEntity> = {
      isDeleted: false,
      isActive: true,
    };

    if (query.category && query.category !== 'all') {
      baseWhere.category = query.category;
    }
    if (query.kind) baseWhere.kind = query.kind;

    const q = query.q?.trim();
    const where: FindOptionsWhere<StockAssetEntity> | FindOptionsWhere<StockAssetEntity>[] =
      q
        ? [
            { ...baseWhere, title: ILike(`%${q}%`) },
            { ...baseWhere, tags: ILike(`%${q}%`) },
          ]
        : baseWhere;

    const [list, total] = await this.repo.findAndCount({
      where,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
      skip,
      take,
    });

    return {
      message: 'Thành công',
      data: list.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        tags: item.tags || [],
        src: item.src,
        thumb: item.thumb || item.src,
        kind: item.kind,
        license: item.license || '',
      })),
      total,
    };
  }

  async pagination(data: PaginationDto<FilterStockAssetDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<StockAssetEntity> = { isDeleted: false };

    if (where.title !== undefined) {
      whereCon.title = ILike(`%${where.title}%`);
    }
    if (where.category !== undefined) whereCon.category = where.category;
    if (where.kind !== undefined) whereCon.kind = where.kind;
    if (where.isActive !== undefined) whereCon.isActive = where.isActive;

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  async findById(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!item) throw new NotFoundException('Không tìm thấy asset');
    return { message: 'Thành công', data: item };
  }

  async create(user: UserDto, dto: CreateStockAssetDto) {
    const entity = new StockAssetEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;
    this.assign(entity, dto);
    entity.isActive = dto.isActive ?? true;
    entity.sortOrder = dto.sortOrder ?? 0;
    const saved = await this.repo.save(entity);
    return { message: 'Tạo asset thành công', data: saved };
  }

  async update(dto: UpdateStockAssetDto, user: UserDto) {
    const entity = await this.requireOne(dto.id);
    entity.updatedBy = user.id;
    this.assign(entity, dto);
    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật thành công', data: saved };
  }

  async delete(data: IdDto, user: UserDto) {
    const entity = await this.requireOne(data.id);
    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xóa thành công' };
  }

  private async requireOne(id: string) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy asset');
    return entity;
  }

  private assign(entity: StockAssetEntity, dto: Partial<CreateStockAssetDto>) {
    if (dto.title !== undefined) entity.title = dto.title.trim();
    if (dto.category !== undefined) entity.category = dto.category;
    if (dto.tags !== undefined) entity.tags = dto.tags;
    if (dto.src !== undefined) entity.src = dto.src.trim();
    if (dto.thumb !== undefined) entity.thumb = dto.thumb?.trim() || undefined;
    if (dto.kind !== undefined) entity.kind = dto.kind;
    if (dto.license !== undefined) entity.license = dto.license?.trim() || undefined;
    if (dto.sortOrder !== undefined) entity.sortOrder = dto.sortOrder;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    if (!entity.thumb && entity.src) entity.thumb = entity.src;
  }
}
