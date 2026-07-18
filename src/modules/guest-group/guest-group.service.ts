import { IdDto, PaginationDto, UserDto } from '@/dto';
import { GuestGroupEntity } from '@/entities';
import { GuestGroupRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateGuestGroupDto,
  FilterGuestGroupDto,
  UpdateGuestGroupDto,
} from './dto';

@Injectable()
export class GuestGroupService {
  constructor(private readonly repo: GuestGroupRepository) {}

  async pagination(data: PaginationDto<FilterGuestGroupDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<GuestGroupEntity> = { isDeleted: false };

    if (where.weddingId !== undefined) whereCon.weddingId = where.weddingId;
    if (where.name !== undefined) whereCon.name = where.name;
    if (where.colorLabel !== undefined) whereCon.colorLabel = where.colorLabel;
    if (where.description !== undefined)
      whereCon.description = where.description;
    if (where.sortOrder !== undefined) whereCon.sortOrder = where.sortOrder;

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  async findById(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!item) throw new NotFoundException('Không tìm thấy bản ghi');
    return { message: 'Thành công', data: item };
  }

  async create(user: UserDto, dto: CreateGuestGroupDto) {
    const entity = new GuestGroupEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.colorLabel !== undefined) entity.colorLabel = dto.colorLabel;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.sortOrder !== undefined) entity.sortOrder = dto.sortOrder;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateGuestGroupDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.updatedBy = user.id;

    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.colorLabel !== undefined) entity.colorLabel = dto.colorLabel;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.sortOrder !== undefined) entity.sortOrder = dto.sortOrder;

    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật thành công', data: saved };
  }

  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xóa thành công' };
  }
}
