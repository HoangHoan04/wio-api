import { IdDto, PaginationDto, UserDto } from '@/dto';
import { TemplateEntity } from '@/entities';
import { TemplateRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
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

    // Tìm kiếm tương đối theo tên nếu có
    if (where.name !== undefined) whereCon.name = ILike(`%${where.name}%`);

    if (where.themeCode !== undefined) whereCon.themeCode = where.themeCode;
    if (where.isShow !== undefined) whereCon.isShow = where.isShow;
    if (where.isPremium !== undefined) whereCon.isPremium = where.isPremium;
    if (where.minPlan !== undefined) whereCon.minPlan = where.minPlan;

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
    if (!item) throw new NotFoundException('Không tìm thấy mẫu giao diện');
    return { message: 'Thành công', data: item };
  }

  async create(user: UserDto, dto: CreateTemplateDto) {
    const entity = new TemplateEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    // Map chuẩn các trường từ dto sang entity
    entity.name = dto.name;
    entity.description = dto.description;
    entity.tags = dto.tags ?? [];
    entity.features = dto.features ?? null;
    entity.thumbnailUrl = dto.thumbnailUrl ?? null;
    entity.themeCode = dto.themeCode;
    entity.isShow = dto.isShow;
    entity.isPremium = dto.isPremium;
    entity.minPlan = dto.minPlan;
    entity.trialDays = dto.trialDays;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateTemplateDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    entity.updatedBy = user.id;

    // Cập nhật các trường nếu có truyền lên (bảo vệ các giá trị cũ)
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.tags !== undefined) entity.tags = dto.tags;
    if (dto.features !== undefined) entity.features = dto.features;
    if (dto.thumbnailUrl !== undefined) entity.thumbnailUrl = dto.thumbnailUrl;
    if (dto.themeCode !== undefined) entity.themeCode = dto.themeCode;
    if (dto.isShow !== undefined) entity.isShow = dto.isShow;
    if (dto.isPremium !== undefined) entity.isPremium = dto.isPremium;
    if (dto.minPlan !== undefined) entity.minPlan = dto.minPlan;
    if (dto.trialDays !== undefined) entity.trialDays = dto.trialDays;

    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật thành công', data: saved };
  }

  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xóa thành công' };
  }

  async activate(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    entity.isShow = true; // Sửa đổi từ isActive thành isShow theo đúng Entity
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Hiển thị mẫu giao diện thành công', data: saved };
  }

  async deactivate(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    entity.isShow = false; // Sửa đổi từ isActive thành isShow theo đúng Entity
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Ẩn mẫu giao diện thành công', data: saved };
  }

  async setPremium(dto: SetPremiumTemplateDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    entity.isPremium = dto.isPremium;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật trạng thái trả phí thành công', data: saved };
  }
}
