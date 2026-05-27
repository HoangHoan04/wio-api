import { IdDto, PaginationDto, UserDto } from '@/dto';
import { WeddingPhotoEntity } from '@/entities';
import { WeddingPhotoRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateWeddingPhotoDto,
  FilterWeddingPhotoDto,
  UpdateWeddingPhotoDto,
} from './dto';

@Injectable()
export class WeddingPhotoService {
  constructor(private readonly repo: WeddingPhotoRepository) {}

  async pagination(data: PaginationDto<FilterWeddingPhotoDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<WeddingPhotoEntity> = { isDeleted: false };

    if (where.weddingId !== undefined) whereCon.weddingId = where.weddingId;
    if (where.url !== undefined) whereCon.url = where.url;
    if (where.storageKey !== undefined) whereCon.storageKey = where.storageKey;
    if (where.caption !== undefined) whereCon.caption = where.caption;
    if (where.sortOrder !== undefined) whereCon.sortOrder = where.sortOrder;

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' } as any,
    });

    return { data: list, total };
  }

  async findById(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false } as any,
    });
    if (!item) throw new NotFoundException('Không tìm thấy bản ghi');
    return { message: 'Thành công', data: item };
  }

  async create(user: UserDto, dto: CreateWeddingPhotoDto) {
    const entity = new WeddingPhotoEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.url !== undefined) entity.url = dto.url;
    if (dto.storageKey !== undefined) entity.storageKey = dto.storageKey;
    if (dto.caption !== undefined) entity.caption = dto.caption;
    if (dto.sortOrder !== undefined) entity.sortOrder = dto.sortOrder;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateWeddingPhotoDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.updatedBy = user.id;

    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.url !== undefined) entity.url = dto.url;
    if (dto.storageKey !== undefined) entity.storageKey = dto.storageKey;
    if (dto.caption !== undefined) entity.caption = dto.caption;
    if (dto.sortOrder !== undefined) entity.sortOrder = dto.sortOrder;

    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật thành công', data: saved };
  }

  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xóa thành công' };
  }
}
