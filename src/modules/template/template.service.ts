import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { TemplateEntity } from '@/entities';
import { TemplateCategoryRepository, TemplateRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogCreateDto } from '../action-log/action-log.dto';
import { ActionLogService } from '../action-log/action-log.service';
import {
  CreateTemplateDto,
  FilterTemplateDto,
  SetIsDeletedTemplateDto,
  SetIsShowTemplateDto,
  SetPremiumTemplateDto,
  UpdateTemplateDto,
} from './dto';

/* ============================================================
 * RELATIONS
 * ============================================================ */
const NESTED_RELATIONS = {
  categories: true,
  minPlan: true,
} as const;

@Injectable()
export class TemplateService {
  constructor(
    private readonly repo: TemplateRepository,
    private readonly categoryRepo: TemplateCategoryRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  /* ============================================================
   * HELPER — Log ActionLog
   * ============================================================ */
  private async logAction(
    user: UserDto,
    actionType: string,
    entity: TemplateEntity,
    note: string,
    oldValue?: any,
    newValue?: any,
  ) {
    const dto: ActionLogCreateDto = {
      entityId: entity.id,
      entityName: 'TemplateEntity',
      actionType,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.fullName || user.email || 'Admin',
      createdNote: note,
      oldValue,
      newValue,
    };
    await this.actionLogService.create(dto);
  }

  /* ============================================================
   * PAGINATION
   * ============================================================ */
  async pagination(data: PaginationDto<FilterTemplateDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<TemplateEntity> = {};

    // Nếu không truyền isDeleted → mặc định false
    whereCon.isDeleted = where.isDeleted ?? false;

    if (where.name) whereCon.name = ILike(`%${where.name}%`);
    if (where.themeCode) whereCon.themeCode = where.themeCode;
    if (where.weddingTheme) whereCon.weddingTheme = where.weddingTheme;
    if (where.isShow !== undefined) whereCon.isShow = where.isShow;
    if (where.isPremium !== undefined) whereCon.isPremium = where.isPremium;
    if (where.minPlanId) whereCon.minPlanId = where.minPlanId;

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: NESTED_RELATIONS,
      skip,
      take,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  /* ============================================================
   * FIND BY ID
   * ============================================================ */
  async findById(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
      relations: NESTED_RELATIONS,
    });
    if (!item) throw new NotFoundException('Không tìm thấy mẫu giao diện');
    return { message: 'Thành công', data: item };
  }

  /* ============================================================
   * INCREMENT VIEW / PREVIEW
   * ============================================================ */
  async incrementView(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!item) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    await this.repo.increment({ id: data.id }, 'viewCount', 1);

    return { message: 'Cập nhật lượt xem thành công' };
  }

  async incrementPreview(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!item) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    await this.repo.increment({ id: data.id }, 'previewCount', 1);

    return { message: 'Cập nhật lượt xem trước thành công' };
  }

  /* ============================================================
   * CREATE
   * ============================================================ */
  async create(user: UserDto, dto: CreateTemplateDto) {
    const slug = dto.slug || this.generateSlug(dto.name);

    const entity = this.repo.create({
      id: uuidv4(),
      name: dto.name,
      slug,
      description: dto.description,
      weddingTheme: dto.weddingTheme,
      tags: dto.tags,
      colorMood: dto.colorMood,
      features: dto.features,
      themeLayout: dto.themeLayout,
      presetTokens: dto.presetTokens,
      thumbnailUrl: dto.thumbnailUrl,
      previewUrl: dto.previewUrl,
      themeCode: dto.themeCode,
      isShow: dto.isShow ?? true,
      isPremium: dto.isPremium ?? false,
      minPlanId: dto.minPlanId,
      trialDays: dto.trialDays ?? 3,
      sortOrder: dto.sortOrder ?? 0,
      viewCount: 0,
      usedCount: 0,
      createdBy: user.id,
    });

    const saved = await this.repo.save(entity);

    // Đồng bộ categories
    if (dto.categories?.length) {
      await this.syncCategories(saved.id, dto.categories);
    }

    await this.logAction(
      user,
      enumData.ACTION_TYPE.CREATE.code,
      saved,
      `Tạo mẫu giao diện: ${saved.name}`,
      undefined,
      saved,
    );

    return { message: 'Tạo template thành công', data: saved };
  }

  /* ============================================================
   * UPDATE
   * ============================================================ */
  async update(dto: UpdateTemplateDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
      relations: NESTED_RELATIONS,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    const oldValue = { ...entity };

    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.slug !== undefined) entity.slug = dto.slug;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.weddingTheme !== undefined) {
      entity.weddingTheme = dto.weddingTheme;
    }
    if (dto.tags !== undefined) entity.tags = dto.tags;
    if (dto.colorMood !== undefined) entity.colorMood = dto.colorMood;
    if (dto.features !== undefined) entity.features = dto.features;
    if (dto.themeLayout !== undefined) entity.themeLayout = dto.themeLayout;
    if (dto.presetTokens !== undefined) entity.presetTokens = dto.presetTokens;
    if (dto.thumbnailUrl !== undefined) {
      entity.thumbnailUrl = dto.thumbnailUrl;
    }
    if (dto.previewUrl !== undefined) entity.previewUrl = dto.previewUrl;
    if (dto.themeCode !== undefined) entity.themeCode = dto.themeCode;
    if (dto.isShow !== undefined) entity.isShow = dto.isShow;
    if (dto.isPremium !== undefined) entity.isPremium = dto.isPremium;
    if (dto.minPlanId !== undefined) entity.minPlanId = dto.minPlanId;
    if (dto.trialDays !== undefined) entity.trialDays = dto.trialDays;
    if (dto.sortOrder !== undefined) entity.sortOrder = dto.sortOrder;

    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);

    // Đồng bộ categories nếu có
    if (dto.categories !== undefined) {
      await this.syncCategories(saved.id, dto.categories);
    }

    await this.logAction(
      user,
      enumData.ACTION_TYPE.UPDATE.code,
      saved,
      `Cập nhật mẫu giao diện: ${saved.name}`,
      oldValue,
      saved,
    );

    return { message: 'Cập nhật template thành công', data: saved };
  }

  /* ============================================================
   * SET STATUS
   * ============================================================ */
  async setIsShow(dto: SetIsShowTemplateDto, user: UserDto) {
    return this.setBooleanFlag(
      dto.id,
      'isShow',
      dto.isShow,
      user,
      `Cập nhật trạng thái hiển thị: ${dto.isShow}`,
    );
  }

  async setPremium(dto: SetPremiumTemplateDto, user: UserDto) {
    return this.setBooleanFlag(
      dto.id,
      'isPremium',
      dto.isPremium,
      user,
      `Cập nhật trạng thái premium: ${dto.isPremium}`,
    );
  }

  async setIsDeleted(dto: SetIsDeletedTemplateDto, user: UserDto) {
    return this.setBooleanFlag(
      dto.id,
      'isDeleted',
      dto.isDeleted,
      user,
      `Cập nhật trạng thái xoá: ${dto.isDeleted}`,
    );
  }

  private async setBooleanFlag(
    id: string,
    field: 'isShow' | 'isPremium' | 'isDeleted',
    value: boolean,
    user: UserDto,
    note: string,
  ) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    const oldValue = { [field]: entity[field] };
    entity[field] = value;
    entity.updatedBy = user.id;

    const saved = await this.repo.save(entity);

    await this.logAction(
      user,
      enumData.ACTION_TYPE.UPDATE.code,
      saved,
      note,
      oldValue,
      { [field]: value },
    );

    return { message: 'Cập nhật template thành công', data: saved };
  }

  /* ============================================================
   * PUBLIC — Danh sách template cho user
   * ============================================================ */
  async listPublic(weddingTheme?: string) {
    const where: FindOptionsWhere<TemplateEntity> = {
      isDeleted: false,
      isShow: true,
    };
    if (weddingTheme) where.weddingTheme = weddingTheme;

    const list = await this.repo.find({
      where,
      relations: NESTED_RELATIONS,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });

    return { message: 'Thành công', data: list };
  }

  /* ============================================================
   * PRIVATE — Sync categories
   * ============================================================ */
  private async syncCategories(templateId: string, categories: string[]) {
    // Xoá cũ
    await this.categoryRepo.delete({ templateId });

    // Tạo mới
    if (!categories.length) return;

    const entities = categories.map((category) =>
      this.categoryRepo.create({
        id: uuidv4(),
        templateId,
        category,
      }),
    );

    await this.categoryRepo.save(entities);
  }

  /* ============================================================
   * PRIVATE — Generate slug
   * ============================================================ */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 100);
  }
}
