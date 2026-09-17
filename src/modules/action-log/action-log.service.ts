import { PaginationDto } from '@/dto';
import { ActionLogEntity } from '@/entities';
import { ActionLogRepository } from '@/repositories';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogCreateDto, ActionLogFilterDto } from './action-log.dto';

@Injectable()
export class ActionLogService {
  constructor(private readonly repo: ActionLogRepository) {}

  /* ============================================================
   * CREATE — 1 bản ghi
   * ============================================================ */
  async create(dto: ActionLogCreateDto): Promise<void> {
    const actionLog = this.repo.create({
      id: uuidv4(),
      createdById: dto.createdById,
      createdByCode: dto.createdByCode,
      createdByName: dto.createdByName,
      createdNote: dto.createdNote,
      actionType: dto.actionType,
      entityId: dto.entityId,
      entityName: dto.entityName,
      oldValue: dto.oldValue,
      newValue: dto.newValue,
      ipAddress: dto.ipAddress,
      userAgent: dto.userAgent,
      location: dto.location,
    });

    await this.repo.insert(actionLog);
  }

  /* ============================================================
   * CREATE — nhiều bản ghi (bulk)
   * ============================================================ */
  async createList(dto: ActionLogCreateDto[]): Promise<void> {
    if (!dto?.length) return;

    const lstInsert: ActionLogEntity[] = dto.map((item) =>
      this.repo.create({
        id: uuidv4(),
        createdById: item.createdById,
        createdByCode: item.createdByCode,
        createdByName: item.createdByName,
        createdNote: item.createdNote,
        actionType: item.actionType,
        entityId: item.entityId,
        entityName: item.entityName,
        oldValue: item.oldValue,
        newValue: item.newValue,
        ipAddress: item.ipAddress,
        userAgent: item.userAgent,
        location: item.location,
      }),
    );

    await this.repo.insert(lstInsert);
  }

  /* ============================================================
   * PAGINATION
   * ============================================================ */
  async pagination(data: PaginationDto<ActionLogFilterDto>) {
    const { skip = 0, take = 10, where = {} } = data || {};
    const whereCon: FindOptionsWhere<ActionLogEntity> = {};

    if (where.entityName) whereCon.entityName = where.entityName;
    if (where.entityId) whereCon.entityId = where.entityId;
    if (where.createdById) whereCon.createdById = where.createdById;
    if (where.createdByName) whereCon.createdByName = where.createdByName;
    if (where.actionType) whereCon.actionType = where.actionType;

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data: list, total };
  }
}
