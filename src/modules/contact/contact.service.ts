import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { ContactEntity } from '@/entities';
import { ContactRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogCreateDto } from '../action-log/action-log.dto';
import { ActionLogService } from '../action-log/action-log.service';
import {
  CreateContactDto,
  FilterContactDto,
  UpdateContactStatusDto,
} from './dto';

@Injectable()
export class ContactService {
  constructor(
    private readonly repo: ContactRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  /* ============================================================
   * HELPER: Tạo ActionLog
   * ============================================================ */
  private async logAction(
    user: UserDto,
    actionType: string,
    entity: ContactEntity,
    oldValue: any,
    note: string,
  ) {
    const dto: ActionLogCreateDto = {
      entityId: entity.id,
      entityName: 'ContactEntity',
      actionType,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.fullName || user.email || 'Admin',
      createdNote: note,
      oldValue,
      newValue: entity,
    };
    await this.actionLogService.create(dto);
  }

  /* ============================================================
   * PUBLIC — Khách gửi liên hệ
   * ============================================================ */
  async createPublicContact(dto: CreateContactDto) {
    const count = await this.repo.count();

    const entity = this.repo.create({
      id: uuidv4(),
      code: `CTK-${1000 + count + 1}`,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      subject: dto.subject || 'Yêu cầu hỗ trợ liên hệ',
      message: dto.message,
      status: enumData.CONTACT_STATUS.PENDING.code,
    });

    const saved = await this.repo.save(entity);

    return {
      message:
        'Gửi lời nhắn liên hệ thành công. InviGo sẽ phản hồi bạn sớm nhất!',
      data: saved,
    };
  }

  /* ============================================================
   * ADMIN — Pagination
   * ============================================================ */
  async pagination(data: PaginationDto<FilterContactDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<ContactEntity> = { isDeleted: false };

    if (where.code) whereCon.code = ILike(`%${where.code}%`);
    if (where.name) whereCon.name = ILike(`%${where.name}%`);
    if (where.email) whereCon.email = ILike(`%${where.email}%`);
    if (where.status) whereCon.status = where.status;

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  /* ============================================================
   * ADMIN — Chi tiết
   * ============================================================ */
  async findById(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!item) throw new NotFoundException('Không tìm thấy yêu cầu liên hệ');
    return { message: 'Thành công', data: item };
  }

  /* ============================================================
   * ADMIN — Cập nhật trạng thái / phản hồi
   * ============================================================ */
  async updateStatus(dto: UpdateContactStatusDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy yêu cầu liên hệ');

    const oldValue = { ...entity };

    entity.status = dto.status;
    if (dto.adminNote !== undefined) entity.adminNote = dto.adminNote;
    entity.respondedAt = new Date();
    entity.respondedBy = user.id;
    entity.updatedBy = user.id;

    const saved = await this.repo.save(entity);

    await this.logAction(
      user,
      enumData.ACTION_TYPE.UPDATE.code,
      saved,
      oldValue,
      `Cập nhật trạng thái liên hệ #${saved.code} thành ${saved.status}`,
    );

    return { message: 'Cập nhật phản hồi liên hệ thành công', data: saved };
  }

  /* ============================================================
   * ADMIN — Xoá mềm
   * ============================================================ */
  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy yêu cầu liên hệ');

    const oldValue = { ...entity };

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);

    await this.logAction(
      user,
      enumData.ACTION_TYPE.DELETE.code,
      saved,
      oldValue,
      `Xóa yêu cầu liên hệ #${entity.code}`,
    );

    return { message: 'Xóa yêu cầu thành công' };
  }
}
