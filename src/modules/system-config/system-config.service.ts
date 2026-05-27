import { IdDto, PaginationDto, UserDto } from '@/dto';
import { SystemConfigEntity } from '@/entities';
import { SystemConfigRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateSystemConfigDto,
  FilterSystemConfigDto,
  UpdateSystemConfigDto,
} from './dto';

@Injectable()
export class SystemConfigService {
  constructor(private readonly repo: SystemConfigRepository) {}

  async pagination(data: PaginationDto<FilterSystemConfigDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<SystemConfigEntity> = { isDeleted: false };

    if (where.code !== undefined) whereCon.code = where.code;
    if (where.name !== undefined) whereCon.name = where.name;
    if (where.type !== undefined) whereCon.type = where.type;
    if (where.value !== undefined) whereCon.value = where.value;

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

  async create(user: UserDto, dto: CreateSystemConfigDto) {
    const entity = new SystemConfigEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.code !== undefined) entity.code = dto.code;
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.type !== undefined) entity.type = dto.type;
    if (dto.value !== undefined) entity.value = dto.value;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateSystemConfigDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.updatedBy = user.id;

    if (dto.code !== undefined) entity.code = dto.code;
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.type !== undefined) entity.type = dto.type;
    if (dto.value !== undefined) entity.value = dto.value;

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
