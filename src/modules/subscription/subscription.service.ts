import { IdDto, PaginationDto, UserDto } from '@/dto';
import { SubscriptionEntity } from '@/entities';
import { SubscriptionRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  AdminChangeSubscriptionPlanDto,
  CreateSubscriptionDto,
  FilterSubscriptionDto,
  UpdateSubscriptionDto,
} from './dto';

@Injectable()
export class SubscriptionService {
  constructor(private readonly repo: SubscriptionRepository) {}

  async pagination(data: PaginationDto<FilterSubscriptionDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<SubscriptionEntity> = { isDeleted: false };

    if (where.userId !== undefined) whereCon.userId = where.userId;
    if (where.weddingId !== undefined) whereCon.weddingId = where.weddingId;
    if (where.planId !== undefined) whereCon.planId = where.planId;
    if (where.status !== undefined) whereCon.status = where.status;
    if (where.startedAt !== undefined) whereCon.startedAt = where.startedAt;
    if (where.expiresAt !== undefined) whereCon.expiresAt = where.expiresAt;
    if (where.paidAmountVnd !== undefined)
      whereCon.paidAmountVnd = where.paidAmountVnd;
    if (where.paymentMethod !== undefined)
      whereCon.paymentMethod = where.paymentMethod;
    if (where.paymentRef !== undefined) whereCon.paymentRef = where.paymentRef;

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

  async create(user: UserDto, dto: CreateSubscriptionDto) {
    const entity = new SubscriptionEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.userId !== undefined) entity.userId = dto.userId;
    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.planId !== undefined) entity.planId = dto.planId;
    if (dto.status !== undefined) entity.status = dto.status;
    if (dto.startedAt !== undefined) entity.startedAt = dto.startedAt;
    if (dto.expiresAt !== undefined) entity.expiresAt = dto.expiresAt;
    if (dto.paidAmountVnd !== undefined)
      entity.paidAmountVnd = dto.paidAmountVnd;
    if (dto.paymentMethod !== undefined)
      entity.paymentMethod = dto.paymentMethod;
    if (dto.paymentRef !== undefined) entity.paymentRef = dto.paymentRef;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateSubscriptionDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.updatedBy = user.id;

    if (dto.userId !== undefined) entity.userId = dto.userId;
    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.planId !== undefined) entity.planId = dto.planId;
    if (dto.status !== undefined) entity.status = dto.status;
    if (dto.startedAt !== undefined) entity.startedAt = dto.startedAt;
    if (dto.expiresAt !== undefined) entity.expiresAt = dto.expiresAt;
    if (dto.paidAmountVnd !== undefined)
      entity.paidAmountVnd = dto.paidAmountVnd;
    if (dto.paymentMethod !== undefined)
      entity.paymentMethod = dto.paymentMethod;
    if (dto.paymentRef !== undefined) entity.paymentRef = dto.paymentRef;

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

  async changePlan(dto: AdminChangeSubscriptionPlanDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.subscriptionId, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy đăng ký');

    entity.planId = dto.planId;
    entity.expiresAt = dto.expiresAt;
    if (dto.paidAmountVnd !== undefined)
      entity.paidAmountVnd = dto.paidAmountVnd;
    if (dto.paymentMethod !== undefined)
      entity.paymentMethod = dto.paymentMethod;
    if (dto.paymentRef !== undefined) entity.paymentRef = dto.paymentRef;

    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Thay đổi gói dịch vụ thành công', data: saved };
  }
}
