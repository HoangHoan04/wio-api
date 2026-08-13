import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { CardTypeEntity } from '@/entities';
import { CardTypeRepository } from '@/repositories';
import { enumOptions } from '@/utils/enum.utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CardTypeService {
  constructor(private readonly repo: CardTypeRepository) {}

  async listActive() {
    const list = await this.repo.find({
      where: { isDeleted: false, isActive: true },
      order: { sortOrder: 'ASC' },
    });
    if (list.length) return { data: list };
    return { data: this.fromEnum() };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<CardTypeEntity> = { isDeleted: false };
    if (data.where?.nameVi) whereCon.nameVi = ILike(`%${data.where.nameVi}%`);
    if (data.where?.code) whereCon.code = data.where.code;
    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { sortOrder: 'ASC' },
    });
    const fallback = this.fromEnum();
    return {
      data: list.length ? list : fallback,
      total: total || fallback.length,
    };
  }

  async findById(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!item) throw new NotFoundException('Không tìm thấy loại thiệp');
    return { message: 'Thành công', data: item };
  }

  async upsertFromEnum(user: UserDto) {
    const existing = await this.repo.find({ where: { isDeleted: false } });
    const byCode = new Map(existing.map((item) => [item.code, item]));
    const saved: CardTypeEntity[] = [];
    for (const item of this.fromEnum()) {
      if (!item.code) continue;
      const current = byCode.get(item.code) || new CardTypeEntity();
      if (!current.id) {
        current.id = uuidv4();
        current.createdBy = user.id;
      }
      Object.assign(current, item);
      current.updatedBy = user.id;
      saved.push(await this.repo.save(current));
    }
    return { message: 'Đồng bộ loại thiệp thành công', data: saved };
  }

  private fromEnum(): Partial<CardTypeEntity>[] {
    return enumOptions(enumData.CARD_TYPE).map((item: any) => ({
      code: item.code,
      nameVi: item.name,
      nameEn: item.name,
      slug: item.slug,
      icon: item.icon,
      accentColor: item.accentColor,
      defaultModules: item.defaultModules,
      defaultGuestGroups: item.defaultGuestGroups,
      hostRoles: item.hostRoles,
      wizardSections: item.wizardSections,
      sortOrder: item.sortOrder,
      isActive: true,
    }));
  }
}
