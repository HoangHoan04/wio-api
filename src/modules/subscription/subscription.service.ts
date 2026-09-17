import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { SubscriptionEntity } from '@/entities';
import { ServicePlanRepository, SubscriptionRepository } from '@/repositories';
import { isAdminUser } from '@/utils/owner.utils';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, MoreThan } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogCreateDto } from '../action-log/action-log.dto';
import { ActionLogService } from '../action-log/action-log.service';
import {
  AdminChangeSubscriptionPlanDto,
  CreateSubscriptionDto,
  FilterSubscriptionDto,
  UpdateSubscriptionDto,
} from './dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly repo: SubscriptionRepository,
    private readonly planRepo: ServicePlanRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  /* ============================================================
   * HELPER — Log ActionLog
   * ============================================================ */
  private async logAction(
    user: UserDto,
    actionType: string,
    entity: SubscriptionEntity,
    note: string,
    oldValue?: any,
    newValue?: any,
  ) {
    const dto: ActionLogCreateDto = {
      entityId: entity.id,
      entityName: 'SubscriptionEntity',
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
   * HELPER — Tính expiresAt
   * ✅ SỬA BUG: query ServicePlanEntity (không phải SubscriptionEntity)
   * ============================================================ */
  private async resolveExpiresAt(
    planId: string,
    startedAt: Date,
    expiresAt?: Date,
  ): Promise<Date> {
    if (expiresAt) return expiresAt;

    const plan = await this.planRepo.findOne({
      where: { id: planId, isDeleted: false },
    });
    if (!plan) {
      throw new BadRequestException('Không tìm thấy gói dịch vụ');
    }

    const durationDays = plan.durationDays || 30;
    return new Date(startedAt.getTime() + durationDays * 86400000);
  }

  /* ============================================================
   * HELPER — Build where
   * ============================================================ */
  private buildWhere(
    filter: FilterSubscriptionDto,
  ): FindOptionsWhere<SubscriptionEntity> {
    const where: FindOptionsWhere<SubscriptionEntity> = { isDeleted: false };

    if (filter.userId) where.userId = filter.userId;
    if (filter.planId) where.planId = filter.planId;
    if (filter.status) where.status = filter.status;
    if (filter.isActive) where.expiresAt = MoreThan(new Date());

    return where;
  }

  /* ============================================================
   * PAGINATION — Admin (toàn hệ thống)
   * ============================================================ */
  async pagination(data: PaginationDto<FilterSubscriptionDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon = this.buildWhere(where);

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: { user: true, plan: true },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  /* ============================================================
   * PAGINATION — User (chỉ subscription của user)
   * ============================================================ */
  async paginationForUser(
    data: PaginationDto<FilterSubscriptionDto>,
    user: UserDto,
  ) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon = this.buildWhere(where);

    // User chỉ xem được subscription của mình
    whereCon.userId = user.id;

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: { plan: true },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  /* ============================================================
   * FIND BY ID
   * ============================================================ */
  async findById(data: IdDto, user?: UserDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
      relations: { user: true, plan: true },
    });
    if (!item) {
      throw new NotFoundException('Không tìm thấy đăng ký gói dịch vụ');
    }

    if (user && !isAdminUser(user) && item.userId !== user.id) {
      throw new ForbiddenException('Bạn không có quyền xem đăng ký này');
    }

    return { message: 'Thành công', data: item };
  }

  /* ============================================================
   * CREATE
   * ============================================================ */
  async create(user: UserDto, dto: CreateSubscriptionDto) {
    const startedAt = dto.startedAt ? new Date(dto.startedAt) : new Date();
    const expiresAt = await this.resolveExpiresAt(
      dto.planId,
      startedAt,
      dto.expiresAt,
    );

    if (expiresAt <= startedAt) {
      throw new BadRequestException('Ngày hết hạn phải sau ngày bắt đầu');
    }

    const entity = this.repo.create({
      id: uuidv4(),
      userId: dto.userId,
      planId: dto.planId,
      status: dto.status || enumData.SUB_STATUS.ACTIVE.code,
      startedAt,
      expiresAt,
      createdBy: user.id,
    });

    const saved = await this.repo.save(entity);

    await this.logAction(
      user,
      enumData.ACTION_TYPE.CREATE.code,
      saved,
      `Tạo mới đăng ký gói dịch vụ cho user #${dto.userId}`,
      undefined,
      saved,
    );

    return { message: 'Tạo đăng ký thành công', data: saved };
  }

  /* ============================================================
   * UPDATE
   * ============================================================ */
  async update(dto: UpdateSubscriptionDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!entity) {
      throw new NotFoundException('Không tìm thấy đăng ký gói dịch vụ');
    }

    const oldValue = { ...entity };

    if (dto.userId !== undefined) entity.userId = dto.userId;
    if (dto.planId !== undefined) {
      // Nếu đổi plan → cần kiểm tra tồn tại
      const plan = await this.planRepo.findOne({
        where: { id: dto.planId, isDeleted: false },
      });
      if (!plan) {
        throw new BadRequestException('Không tìm thấy gói dịch vụ');
      }
      entity.planId = dto.planId;
    }
    if (dto.status !== undefined) entity.status = dto.status;
    if (dto.startedAt !== undefined) entity.startedAt = dto.startedAt;
    if (dto.expiresAt !== undefined) entity.expiresAt = dto.expiresAt;

    if (entity.expiresAt <= entity.startedAt) {
      throw new BadRequestException('Ngày hết hạn phải sau ngày bắt đầu');
    }

    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);

    await this.logAction(
      user,
      enumData.ACTION_TYPE.UPDATE.code,
      saved,
      `Cập nhật đăng ký gói dịch vụ #${saved.id}`,
      oldValue,
      saved,
    );

    return { message: 'Cập nhật thành công', data: saved };
  }

  /* ============================================================
   * DELETE (soft)
   * ============================================================ */
  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) {
      throw new NotFoundException('Không tìm thấy đăng ký gói dịch vụ');
    }

    const oldValue = { ...entity };

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);

    await this.logAction(
      user,
      enumData.ACTION_TYPE.DELETE.code,
      saved,
      `Xoá đăng ký gói dịch vụ #${entity.id}`,
      oldValue,
      saved,
    );

    return { message: 'Xoá đăng ký thành công' };
  }

  /* ============================================================
   * ADMIN — Change plan
   * ============================================================ */
  async changePlan(dto: AdminChangeSubscriptionPlanDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.subscriptionId, isDeleted: false },
    });
    if (!entity) {
      throw new NotFoundException('Không tìm thấy đăng ký gói dịch vụ');
    }

    // Validate plan tồn tại
    const plan = await this.planRepo.findOne({
      where: { id: dto.planId, isDeleted: false },
    });
    if (!plan) {
      throw new BadRequestException('Không tìm thấy gói dịch vụ mới');
    }

    if (dto.expiresAt <= entity.startedAt) {
      throw new BadRequestException('Ngày hết hạn mới phải sau ngày bắt đầu');
    }

    const oldValue = { ...entity };

    entity.planId = dto.planId;
    entity.expiresAt = dto.expiresAt;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);

    await this.logAction(
      user,
      enumData.ACTION_TYPE.UPDATE.code,
      saved,
      `Thay đổi gói dịch vụ đăng ký #${saved.id} sang ${plan.name}`,
      oldValue,
      saved,
    );

    return { message: 'Thay đổi gói dịch vụ thành công', data: saved };
  }

  /* ============================================================
   * HELPER — Lấy subscription ACTIVE hiện tại của user
   * Dùng cho AuthService / getUserInfo
   * ============================================================ */
  async getActiveByUser(userId: string) {
    return this.repo.findOne({
      where: {
        userId,
        status: enumData.SUB_STATUS.ACTIVE.code,
        expiresAt: MoreThan(new Date()),
        isDeleted: false,
      },
      relations: { plan: true },
      order: { expiresAt: 'DESC' },
    });
  }

  /* ============================================================
   * HELPER — Kiểm tra user có subscription còn hiệu lực
   * ============================================================ */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const count = await this.repo.count({
      where: {
        userId,
        status: enumData.SUB_STATUS.ACTIVE.code,
        expiresAt: MoreThan(new Date()),
        isDeleted: false,
      },
    });
    return count > 0;
  }
}
