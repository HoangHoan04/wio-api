import { PaginationDto } from '@/dto';
import { ActionLogEntity } from '@/entities';
import { ActionLogRepository } from '@/repositories';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogCreateDto } from './action-log.dto';

@Injectable()
export class ActionLogService {
  constructor(private repo: ActionLogRepository) {}

  async create(dto: ActionLogCreateDto): Promise<void> {
    const actionLog = new ActionLogEntity();
    actionLog.id = uuidv4();
    actionLog.createdById = dto.createdById;
    actionLog.createdByCode = dto.createdByCode;
    actionLog.createdByName = dto.createdByName;
    actionLog.createdNote = dto.createdNote;
    actionLog.actionType = dto.actionType;
    actionLog.entityId = dto.entityId;
    actionLog.entityName = dto.entityName;
    actionLog.oldValue = dto.oldValue;
    actionLog.newValue = dto.newValue;
    actionLog.ipAddress = dto.ipAddress;
    actionLog.userAgent = dto.userAgent;
    actionLog.location = dto.location;
    await this.repo.insert(actionLog);
  }

  async createList(dto: ActionLogCreateDto[]): Promise<void> {
    const lstInsert: ActionLogEntity[] = [];
    for (const item of dto) {
      const actionLog = new ActionLogEntity();
      actionLog.id = uuidv4();
      actionLog.createdById = item.createdById;
      actionLog.createdByCode = item.createdByCode;
      actionLog.createdByName = item.createdByName;
      actionLog.createdNote = item.createdNote;
      actionLog.actionType = item.actionType;
      actionLog.entityId = item.entityId;
      actionLog.entityName = item.entityName;
      actionLog.oldValue = item.oldValue;
      actionLog.newValue = item.newValue;
      actionLog.ipAddress = item.ipAddress;
      actionLog.userAgent = item.userAgent;
      actionLog.location = item.location;

      lstInsert.push(actionLog);
    }
    await this.repo.insert(lstInsert);
  }

  async pagination(data: PaginationDto) {
    const { skip = 0, take = 10, where = {} } = data || {};
    const whereCon: FindOptionsWhere<ActionLogEntity> = {};

    if (where.entityName) whereCon.entityName = where.entityName;
    if (where.entityId) whereCon.entityId = where.entityId;
    if (where.createdBy) whereCon.createdById = where.createdBy;
    if (where.actionType) whereCon.actionType = where.actionType;

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: list,
      total,
    };
  }
}
