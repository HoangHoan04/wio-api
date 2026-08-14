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

  async createPublicContact(dto: CreateContactDto) {
    const entity = new ContactEntity();
    entity.id = uuidv4();
    const count = await this.repo.count();
    entity.code = `CTK-${1000 + count + 1}`;
    entity.name = dto.name;
    entity.email = dto.email;
    if (dto.phone) entity.phone = dto.phone;
    entity.subject = dto.subject || 'Yêu cầu hỗ trợ liên hệ';
    entity.message = dto.message;
    entity.status = 'PENDING';

    const saved = await this.repo.save(entity);
    return {
      message:
        'Gửi lời nhắn liên hệ thành công. InviGo sẽ phản hồi bạn sớm nhất!',
      data: saved,
    };
  }

  async pagination(data: PaginationDto<FilterContactDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<ContactEntity> = { isDeleted: false };

    if (where.code !== undefined) whereCon.code = ILike(`%${where.code}%`);
    if (where.name !== undefined) whereCon.name = ILike(`%${where.name}%`);
    if (where.email !== undefined) whereCon.email = ILike(`%${where.email}%`);
    if (where.status !== undefined) whereCon.status = where.status;

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
    if (!item) throw new NotFoundException('Không tìm thấy yêu cầu liên hệ');
    return { message: 'Thành công', data: item };
  }

  async updateStatus(dto: UpdateContactStatusDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy yêu cầu liên hệ');

    const oldValueStr = JSON.stringify(entity);

    entity.status = dto.status;
    if (dto.adminNote !== undefined) entity.adminNote = dto.adminNote;
    entity.respondedAt = new Date();
    entity.respondedBy = user.id;
    entity.updatedBy = user.id;

    const saved = await this.repo.save(entity);

    const actionLogDto: ActionLogCreateDto = {
      entityId: saved.id,
      entityName: 'ContactEntity',
      actionType: enumData.ACTION_TYPE.UPDATE.code,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.fullName || user.email || 'Admin',
      createdNote: `Cập nhật trạng thái liên hệ #${saved.code} thành ${saved.status}`,
      oldValue: oldValueStr,
      newValue: JSON.stringify(saved),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Cập nhật phản hồi liên hệ thành công', data: saved };
  }

  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy yêu cầu liên hệ');

    const oldValueStr = JSON.stringify(entity);

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);

    const actionLogDto: ActionLogCreateDto = {
      entityId: entity.id,
      entityName: 'ContactEntity',
      actionType: enumData.ACTION_TYPE.DELETE.code,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.fullName || user.email || 'Admin',
      createdNote: `Xóa yêu cầu liên hệ #${entity.code}`,
      oldValue: oldValueStr,
      newValue: JSON.stringify(saved),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Xóa yêu cầu thành công' };
  }
}
