import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { ServicePlanEntity } from '@/entities';
import { ServicePlanRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Between,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogCreateDto } from '../action-log/action-log.dto';
import { ActionLogService } from '../action-log/action-log.service';
import {
  CreateServicePlanDto,
  FilterServicePlanDto,
  UpdateServicePlanDto,
} from './dto';

@Injectable()
export class ServicePlanService {
  constructor(
    private readonly repo: ServicePlanRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  /* ============================================================
   * HELPER — Ghi ActionLog
   * ============================================================ */
  private async logAction(
    user: UserDto,
    actionType: string,
    entity: ServicePlanEntity,
    note: string,
    oldValue?: any,
    newValue?: any,
  ) {
    const dto: ActionLogCreateDto = {
      entityId: entity.id,
      entityName: 'ServicePlanEntity',
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
   * PUBLIC — Danh sách gói đang hoạt động
   * ============================================================ */
  async findActivePlans() {
    const list = await this.repo.find({
      where: { isActive: true, isDeleted: false },
      order: { sortOrder: 'ASC', priceVnd: 'ASC' },
    });
    return { message: 'Thành công', data: list };
  }

  /* ============================================================
   * ADMIN — Pagination
   * ============================================================ */
  async pagination(data: PaginationDto<FilterServicePlanDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<ServicePlanEntity> = { isDeleted: false };

    if (where.name) whereCon.name = ILike(`%${where.name}%`);
    if (where.code) whereCon.code = where.code;
    if (where.hasAi !== undefined) whereCon.hasAi = where.hasAi;
    if (where.hasAnalytics !== undefined) {
      whereCon.hasAnalytics = where.hasAnalytics;
    }
    if (where.hasCustomSlug !== undefined) {
      whereCon.hasCustomSlug = where.hasCustomSlug;
    }
    if (where.hasCustomDesign !== undefined) {
      whereCon.hasCustomDesign = where.hasCustomDesign;
    }
    if (where.isActive !== undefined) whereCon.isActive = where.isActive;

    // Price range
    if (where.priceVndMin && where.priceVndMax) {
      whereCon.priceVnd = Between(where.priceVndMin, where.priceVndMax);
    } else if (where.priceVndMin) {
      whereCon.priceVnd = MoreThanOrEqual(where.priceVndMin);
    } else if (where.priceVndMax) {
      whereCon.priceVnd = LessThanOrEqual(where.priceVndMax);
    }

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
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!item) throw new NotFoundException('Không tìm thấy gói dịch vụ');
    return { message: 'Thành công', data: item };
  }

  /* ============================================================
   * ADMIN — Create
   * ============================================================ */
  async create(user: UserDto, dto: CreateServicePlanDto) {
    const entity = this.repo.create({
      id: uuidv4(),
      name: dto.name,
      code: dto.code,
      maxInvitations: dto.maxInvitations,
      maxGuests: dto.maxGuests,
      maxPhotos: dto.maxPhotos,
      hasAi: dto.hasAi,
      hasAnalytics: dto.hasAnalytics,
      hasCustomSlug: dto.hasCustomSlug,
      hasCustomDesign: dto.hasCustomDesign,
      durationDays: dto.durationDays,
      priceVnd: dto.priceVnd,
      isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: user.id,
    });

    const saved = await this.repo.save(entity);

    await this.logAction(
      user,
      enumData.ACTION_TYPE.CREATE.code,
      saved,
      `Tạo mới gói dịch vụ: ${saved.name}`,
      undefined,
      saved,
    );

    return { message: 'Tạo gói dịch vụ thành công', data: saved };
  }

  /* ============================================================
   * ADMIN — Update
   * ============================================================ */
  async update(dto: UpdateServicePlanDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy gói dịch vụ');

    const oldValue = { ...entity };

    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.code !== undefined) entity.code = dto.code;
    if (dto.maxInvitations !== undefined) {
      entity.maxInvitations = dto.maxInvitations;
    }
    if (dto.maxGuests !== undefined) entity.maxGuests = dto.maxGuests;
    if (dto.maxPhotos !== undefined) entity.maxPhotos = dto.maxPhotos;
    if (dto.hasAi !== undefined) entity.hasAi = dto.hasAi;
    if (dto.hasAnalytics !== undefined) {
      entity.hasAnalytics = dto.hasAnalytics;
    }
    if (dto.hasCustomSlug !== undefined) {
      entity.hasCustomSlug = dto.hasCustomSlug;
    }
    if (dto.hasCustomDesign !== undefined) {
      entity.hasCustomDesign = dto.hasCustomDesign;
    }
    if (dto.durationDays !== undefined) entity.durationDays = dto.durationDays;
    if (dto.priceVnd !== undefined) entity.priceVnd = dto.priceVnd;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    if (dto.sortOrder !== undefined) entity.sortOrder = dto.sortOrder;

    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);

    await this.logAction(
      user,
      enumData.ACTION_TYPE.UPDATE.code,
      saved,
      `Cập nhật gói dịch vụ: ${saved.name}`,
      oldValue,
      saved,
    );

    return { message: 'Cập nhật gói dịch vụ thành công', data: saved };
  }

  /* ============================================================
   * ADMIN — Delete (soft)
   * ============================================================ */
  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy gói dịch vụ');

    const oldValue = { ...entity };

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);

    await this.logAction(
      user,
      enumData.ACTION_TYPE.DELETE.code,
      saved,
      `Xoá gói dịch vụ: ${entity.name}`,
      oldValue,
      saved,
    );

    return { message: 'Xoá gói dịch vụ thành công' };
  }

  /* ============================================================
   * ADMIN — Select box
   * ============================================================ */
  async selectBox() {
    const list = await this.repo.find({
      where: { isDeleted: false },
      select: {
        id: true,
        code: true,
        name: true,
        priceVnd: true,
      },
      order: { sortOrder: 'ASC', priceVnd: 'ASC' },
    });
    return { message: 'Thành công', data: list };
  }
}
