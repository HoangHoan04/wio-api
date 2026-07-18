import { IdDto, PaginationDto, UserDto } from '@/dto';
import { NotificationEntity } from '@/entities';
import { NotificationRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateNotificationDto,
  FilterNotificationDto,
  UpdateNotificationDto,
} from './dto';

@Injectable()
export class NotificationService {
  constructor(private readonly repo: NotificationRepository) {}

  async pagination(data: PaginationDto<FilterNotificationDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<NotificationEntity> = { isDeleted: false };

    if (where.weddingId !== undefined) whereCon.weddingId = where.weddingId;
    if (where.guestId !== undefined) whereCon.guestId = where.guestId;
    if (where.channel !== undefined) whereCon.channel = where.channel;
    if (where.type !== undefined) whereCon.type = where.type;
    if (where.subject !== undefined) whereCon.subject = where.subject;
    if (where.content !== undefined) whereCon.content = where.content;
    if (where.status !== undefined) whereCon.status = where.status;
    if (where.scheduledAt !== undefined)
      whereCon.scheduledAt = where.scheduledAt;
    if (where.sentAt !== undefined) whereCon.sentAt = where.sentAt;
    if (where.failedReason !== undefined)
      whereCon.failedReason = where.failedReason;
    if (where.provider !== undefined) whereCon.provider = where.provider;
    if (where.providerMsgId !== undefined)
      whereCon.providerMsgId = where.providerMsgId;

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
    if (!item) throw new NotFoundException('Không tìm thấy bản ghi');
    return { message: 'Thành công', data: item };
  }

  async create(user: UserDto, dto: CreateNotificationDto) {
    const entity = new NotificationEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.guestId !== undefined) entity.guestId = dto.guestId;
    if (dto.channel !== undefined) entity.channel = dto.channel;
    if (dto.type !== undefined) entity.type = dto.type;
    if (dto.subject !== undefined) entity.subject = dto.subject;
    if (dto.content !== undefined) entity.content = dto.content;
    if (dto.status !== undefined) entity.status = dto.status;
    if (dto.scheduledAt !== undefined) entity.scheduledAt = dto.scheduledAt;
    if (dto.sentAt !== undefined) entity.sentAt = dto.sentAt;
    if (dto.failedReason !== undefined) entity.failedReason = dto.failedReason;
    if (dto.provider !== undefined) entity.provider = dto.provider;
    if (dto.providerMsgId !== undefined)
      entity.providerMsgId = dto.providerMsgId;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateNotificationDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.updatedBy = user.id;

    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.guestId !== undefined) entity.guestId = dto.guestId;
    if (dto.channel !== undefined) entity.channel = dto.channel;
    if (dto.type !== undefined) entity.type = dto.type;
    if (dto.subject !== undefined) entity.subject = dto.subject;
    if (dto.content !== undefined) entity.content = dto.content;
    if (dto.status !== undefined) entity.status = dto.status;
    if (dto.scheduledAt !== undefined) entity.scheduledAt = dto.scheduledAt;
    if (dto.sentAt !== undefined) entity.sentAt = dto.sentAt;
    if (dto.failedReason !== undefined) entity.failedReason = dto.failedReason;
    if (dto.provider !== undefined) entity.provider = dto.provider;
    if (dto.providerMsgId !== undefined)
      entity.providerMsgId = dto.providerMsgId;

    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật thành công', data: saved };
  }

  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xóa thành công' };
  }
}
