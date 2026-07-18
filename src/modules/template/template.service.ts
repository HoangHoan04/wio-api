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

const THEME_SLUG_MAP: Record<string, string> = {
  BOHO_FLORAL_BROWN: 'hoa-moc-lan-nau',
  BOHO_FLORAL_GREEN: 'hoa-moc-lan-xanh',
  BOHO_FLORAL_PINK: 'hoa-moc-lan-hong',
  DOUBLE_PHOENIX_BLUE: 'song-phung-xanh',
  DOUBLE_PHOENIX_GREEN: 'song-phung-xanh-la',
  DOUBLE_PHOENIX_RED: 'song-phung-do',
  DOUBLE_DRAGON_BLUE: 'song-long-xanh',
  DOUBLE_DRAGON_GREEN: 'song-long-xanh-la',
  DOUBLE_DRAGON_RED: 'song-long-do',
  DRAGON_PHOENIX_BLUE: 'long-phung-xanh',
  DRAGON_PHOENIX_GREEN: 'long-phung-xanh-la',
  DRAGON_PHOENIX_RED: 'long-phung-do',
  ROYAL_BLUE: 'hoang-gia-xanh',
  ROYAL_GREEN: 'hoang-gia-xanh-la',
  ROYAL_RED: 'hoang-gia-do',
  RED_DOUBLE_HAPPINESS: 'song-hy-do',
};

@Injectable()
export class TemplateService {
  constructor(private readonly repo: TemplateRepository) {}

  async pagination(data: PaginationDto<FilterTemplateDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<TemplateEntity> = { isDeleted: false };

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
    entity.name = dto.name;
    entity.description = dto.description;
    entity.tags = dto.tags ?? [];
    entity.features = dto.features ?? null;
    entity.thumbnailUrl = dto.thumbnailUrl;
    entity.themeCode = dto.themeCode;
    entity.slug =
      THEME_SLUG_MAP[dto.themeCode] ||
      `${dto.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    entity.isShow = dto.isShow;
    entity.isPremium = dto.isPremium;
    entity.minPlan = dto.minPlan;
    entity.trialDays = dto.trialDays;
    entity.createdBy = user.id;
    entity.createdAt = new Date();

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateTemplateDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    entity.updatedBy = user.id;
    entity.updatedAt = new Date();
    if (dto.name !== undefined) {
      entity.name = dto.name;
      if (!entity.slug || !THEME_SLUG_MAP[dto.themeCode || entity.themeCode]) {
        entity.slug = `${dto.name.toLowerCase().trim().replace(/\s+/g, '-')}-${Date.now()}`;
      }
    }
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.tags !== undefined) entity.tags = dto.tags;
    if (dto.features !== undefined) entity.features = dto.features;
    if (dto.thumbnailUrl !== undefined) entity.thumbnailUrl = dto.thumbnailUrl;
    if (dto.themeCode !== undefined) {
      entity.themeCode = dto.themeCode;
      if (THEME_SLUG_MAP[dto.themeCode]) {
        entity.slug = THEME_SLUG_MAP[dto.themeCode];
      }
    }
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

    entity.isShow = true;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Hiển thị mẫu giao diện thành công', data: saved };
  }

  async deactivate(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    entity.isShow = false;
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
