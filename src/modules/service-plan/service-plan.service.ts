import { IdDto, PaginationDto, UserDto } from '@/dto';
import { ServicePlanEntity } from '@/entities';
import { ServicePlanRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateServicePlanDto,
  FilterServicePlanDto,
  UpdateServicePlanDto,
} from './dto';

@Injectable()
export class ServicePlanService {
  constructor(private readonly repo: ServicePlanRepository) {}

  async pagination(data: PaginationDto<FilterServicePlanDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<ServicePlanEntity> = { isDeleted: false };

    if (where.name !== undefined) whereCon.name = where.name;
    if (where.maxGuests !== undefined) whereCon.maxGuests = where.maxGuests;
    if (where.maxPhotos !== undefined) whereCon.maxPhotos = where.maxPhotos;
    if (where.maxTemplates !== undefined)
      whereCon.maxTemplates = where.maxTemplates;
    if (where.hasAi !== undefined) whereCon.hasAi = where.hasAi;
    if (where.hasAnalytics !== undefined)
      whereCon.hasAnalytics = where.hasAnalytics;
    if (where.hasCustomSlug !== undefined)
      whereCon.hasCustomSlug = where.hasCustomSlug;
    if (where.durationDays !== undefined)
      whereCon.durationDays = where.durationDays;
    if (where.priceVnd !== undefined) whereCon.priceVnd = where.priceVnd;
    if (where.isActive !== undefined) whereCon.isActive = where.isActive;

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

  async create(user: UserDto, dto: CreateServicePlanDto) {
    const entity = new ServicePlanEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.maxGuests !== undefined) entity.maxGuests = dto.maxGuests;
    if (dto.maxPhotos !== undefined) entity.maxPhotos = dto.maxPhotos;
    if (dto.maxTemplates !== undefined) entity.maxTemplates = dto.maxTemplates;
    if (dto.hasAi !== undefined) entity.hasAi = dto.hasAi;
    if (dto.hasAnalytics !== undefined) entity.hasAnalytics = dto.hasAnalytics;
    if (dto.hasCustomSlug !== undefined)
      entity.hasCustomSlug = dto.hasCustomSlug;
    if (dto.durationDays !== undefined) entity.durationDays = dto.durationDays;
    if (dto.priceVnd !== undefined) entity.priceVnd = dto.priceVnd;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateServicePlanDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.updatedBy = user.id;

    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.maxGuests !== undefined) entity.maxGuests = dto.maxGuests;
    if (dto.maxPhotos !== undefined) entity.maxPhotos = dto.maxPhotos;
    if (dto.maxTemplates !== undefined) entity.maxTemplates = dto.maxTemplates;
    if (dto.hasAi !== undefined) entity.hasAi = dto.hasAi;
    if (dto.hasAnalytics !== undefined) entity.hasAnalytics = dto.hasAnalytics;
    if (dto.hasCustomSlug !== undefined)
      entity.hasCustomSlug = dto.hasCustomSlug;
    if (dto.durationDays !== undefined) entity.durationDays = dto.durationDays;
    if (dto.priceVnd !== undefined) entity.priceVnd = dto.priceVnd;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;

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
