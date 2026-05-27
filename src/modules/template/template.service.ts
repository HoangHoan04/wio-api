import { IdDto, PaginationDto, UserDto } from '@/dto';
import { TemplateEntity } from '@/entities';
import { TemplateRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateTemplateDto,
  FilterTemplateDto,
  SetPremiumTemplateDto,
  UpdateTemplateDto,
} from './dto';

@Injectable()
export class TemplateService {
  constructor(private readonly repo: TemplateRepository) {}

  async pagination(data: PaginationDto<FilterTemplateDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<TemplateEntity> = { isDeleted: false };

    if (where.name !== undefined) whereCon.name = where.name;
    if (where.thumbnailUrl !== undefined)
      whereCon.thumbnailUrl = where.thumbnailUrl;
    if (where.cssConfig !== undefined) whereCon.cssConfig = where.cssConfig;
    if (where.previewUrl !== undefined) whereCon.previewUrl = where.previewUrl;
    if (where.isActive !== undefined) whereCon.isActive = where.isActive;
    if (where.isPremium !== undefined) whereCon.isPremium = where.isPremium;
    if (where.minPlan !== undefined) whereCon.minPlan = where.minPlan;
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

  async create(user: UserDto, dto: CreateTemplateDto) {
    const entity = new TemplateEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.thumbnailUrl !== undefined) entity.thumbnailUrl = dto.thumbnailUrl;
    if (dto.cssConfig !== undefined) entity.cssConfig = dto.cssConfig;
    if (dto.previewUrl !== undefined) entity.previewUrl = dto.previewUrl;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    if (dto.isPremium !== undefined) entity.isPremium = dto.isPremium;
    if (dto.minPlan !== undefined) entity.minPlan = dto.minPlan;
    if (dto.sortOrder !== undefined) entity.sortOrder = dto.sortOrder;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateTemplateDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.updatedBy = user.id;

    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.thumbnailUrl !== undefined) entity.thumbnailUrl = dto.thumbnailUrl;
    if (dto.cssConfig !== undefined) entity.cssConfig = dto.cssConfig;
    if (dto.previewUrl !== undefined) entity.previewUrl = dto.previewUrl;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    if (dto.isPremium !== undefined) entity.isPremium = dto.isPremium;
    if (dto.minPlan !== undefined) entity.minPlan = dto.minPlan;
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

  async activate(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.isActive = true;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Kích hoạt thành công', data: saved };
  }

  async deactivate(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.isActive = false;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Hủy kích hoạt thành công', data: saved };
  }

  async setPremium(dto: SetPremiumTemplateDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.isPremium = dto.isPremium;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật trạng thái trả phí thành công', data: saved };
  }
}
