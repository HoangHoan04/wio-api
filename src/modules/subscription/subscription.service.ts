import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { SubscriptionEntity } from '@/entities';
import { SubscriptionRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
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
    private readonly actionLogService: ActionLogService,
  ) {}

  async pagination(data: PaginationDto<FilterSubscriptionDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<SubscriptionEntity> = { isDeleted: false };

    if (where.userId !== undefined) whereCon.userId = where.userId;
    if (where.planId !== undefined) whereCon.planId = where.planId;

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: ['user', 'plan'],
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  async findById(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
      relations: ['user', 'plan'],
    });
    if (!item) throw new NotFoundException('Không tìm thấy đăng ký gói dịch vụ');
    return { message: 'Thành công', data: item };
  }

  async create(user: UserDto, dto: CreateSubscriptionDto) {
    const entity = new SubscriptionEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.userId !== undefined) entity.userId = dto.userId;
    if (dto.planId !== undefined) entity.planId = dto.planId;

    const saved = await this.repo.save(entity);

    const actionLogDto: ActionLogCreateDto = {
      entityId: saved.id,
      entityName: 'SubscriptionEntity',
      actionType: enumData.ACTION_TYPE.CREATE.code,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.fullName || user.email || 'System',
      createdNote: `Tạo mới đăng ký gói dịch vụ #${saved.id}`,
      oldValue: '{}',
      newValue: JSON.stringify(saved),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateSubscriptionDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy đăng ký gói dịch vụ');

    const oldValueStr = JSON.stringify(entity);

    entity.updatedBy = user.id;

    if (dto.userId !== undefined) entity.userId = dto.userId;
    if (dto.planId !== undefined) entity.planId = dto.planId;

    const saved = await this.repo.save(entity);

    const actionLogDto: ActionLogCreateDto = {
      entityId: saved.id,
      entityName: 'SubscriptionEntity',
      actionType: enumData.ACTION_TYPE.UPDATE.code,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.fullName || user.email || 'Admin',
      createdNote: `Cập nhật đăng ký gói dịch vụ #${saved.id}`,
      oldValue: oldValueStr,
      newValue: JSON.stringify(saved),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Cập nhật thành công', data: saved };
  }

  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy đăng ký gói dịch vụ');

    const oldValueStr = JSON.stringify(entity);

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);

    const actionLogDto: ActionLogCreateDto = {
      entityId: entity.id,
      entityName: 'SubscriptionEntity',
      actionType: enumData.ACTION_TYPE.DELETE.code,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.fullName || user.email || 'Admin',
      createdNote: `Xóa đăng ký gói dịch vụ #${entity.id}`,
      oldValue: oldValueStr,
      newValue: JSON.stringify(saved),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Xóa thành công' };
  }

  async changePlan(dto: AdminChangeSubscriptionPlanDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.subscriptionId, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy đăng ký gói dịch vụ');

    const oldValueStr = JSON.stringify(entity);

    entity.planId = dto.planId;
    entity.expiresAt = dto.expiresAt;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);

    const actionLogDto: ActionLogCreateDto = {
      entityId: saved.id,
      entityName: 'SubscriptionEntity',
      actionType: enumData.ACTION_TYPE.UPDATE.code,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.fullName || user.email || 'Admin',
      createdNote: `Thay đổi gói dịch vụ đăng ký #${saved.id}`,
      oldValue: oldValueStr,
      newValue: JSON.stringify(saved),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Thay đổi gói dịch vụ thành công', data: saved };
  }
}
