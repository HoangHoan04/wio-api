import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { TemplateCardTypeEntity, TemplateEntity } from '@/entities';
import { TemplateCardTypeRepository, TemplateRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogCreateDto } from '../action-log/action-log.dto';
import { ActionLogService } from '../action-log/action-log.service';
import {
  CreateTemplateDto,
  SetIsDeletedTemplateDto,
  SetIsShowTemplateDto,
  SetPremiumTemplateDto,
  UpdateTemplateDto,
} from './dto';

@Injectable()
export class TemplateService {
  constructor(
    private readonly repo: TemplateRepository,
    private readonly cardTypeRepo: TemplateCardTypeRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async pagination(data: PaginationDto) {
    const qb = this.repo
      .createQueryBuilder('tpl')
      .leftJoinAndSelect('tpl.minPlan', 'minPlan')
      .leftJoinAndSelect('tpl.cardTypes', 'cardTypes');

    if (data.where?.name !== undefined)
      qb.andWhere('tpl.name ILIKE :name', { name: `%${data.where.name}%` });
    if (data.where?.themeCode !== undefined)
      qb.andWhere('tpl.themeCode = :themeCode', {
        themeCode: data.where.themeCode,
      });
    if (data.where?.isShow !== undefined)
      qb.andWhere('tpl.isShow = :isShow', { isShow: data.where.isShow });
    if (data.where?.isPremium !== undefined)
      qb.andWhere('tpl.isPremium = :isPremium', {
        isPremium: data.where.isPremium,
      });
    if (data.where?.minPlanId !== undefined)
      qb.andWhere('tpl.minPlanId = :minPlanId', {
        minPlanId: data.where.minPlanId,
      });
    if ([true, false].includes(data.where?.isDeleted))
      qb.andWhere('tpl.isDeleted = :isDeleted', {
        isDeleted: data.where.isDeleted,
      });
    if (data.where?.cardType) {
      qb.andWhere(
        `EXISTS (
          SELECT 1 FROM template_card_types tct
          WHERE tct."templateId" = tpl.id
            AND tct."cardType" = :cardType
            AND tct."isDeleted" = false
        )`,
        { cardType: data.where.cardType },
      );
    }

    const [list, total] = await qb
      .skip(data.skip)
      .take(data.take)
      .orderBy('tpl.createdAt', 'DESC')
      .getManyAndCount();

    return { data: list, total };
  }

  async findById(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id },
      relations: ['minPlan'],
    });
    if (!item) throw new NotFoundException('Không tìm thấy mẫu giao diện');
    return { message: 'Thành công', data: item };
  }

  async incrementView(data: IdDto) {
    const item = await this.repo.findOne({ where: { id: data.id } });
    if (!item) throw new NotFoundException('Không tìm thấy mẫu giao diện');
    item.viewCount = (item.viewCount ?? 0) + 1;
    await this.repo.save(item);
    return {
      message: 'Cập nhật lượt dùng thành công',
      data: { viewCount: item.viewCount },
    };
  }

  async incrementPreview(data: IdDto) {
    const item = await this.repo.findOne({ where: { id: data.id } });
    if (!item) throw new NotFoundException('Không tìm thấy mẫu giao diện');
    item.previewCount = (item.previewCount ?? 0) + 1;
    await this.repo.save(item);
    return {
      message: 'Cập nhật lượt xem trước thành công',
      data: { previewCount: item.previewCount },
    };
  }

  async create(user: UserDto, dto: CreateTemplateDto) {
    const template = new TemplateEntity();
    template.id = uuidv4();
    template.name = dto.name;
    template.description = dto.description;
    template.tags = dto.tags ?? [];
    template.features = dto.features ?? null;
    template.thumbnailUrl = dto.thumbnailUrl;
    template.themeCode = dto.themeCode;
    template.slug =
      enumData.THEME_CODE[dto.themeCode]?.slug ||
      `${dto.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    template.isShow = true;
    template.isPremium = dto.isPremium;
    template.minPlanId = dto.minPlanId;
    template.trialDays = dto.trialDays;
    template.createdBy = user.id;
    template.createdAt = new Date();

    const saved = await this.repo.save(template);
    await this.syncCardTypes(saved.id, dto.cardTypes);

    const actionLogDto: ActionLogCreateDto = {
      entityId: template.id,
      entityName: 'TemplateEntity',
      actionType: enumData.ACTION_TYPE.CREATE.code,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.fullName || user.email,
      createdNote: `Nhân viên ${user.fullName} tạo mới template: ${template.name} `,
      oldValue: '{}',
      newValue: JSON.stringify(template),
    };

    await this.actionLogService.create(actionLogDto);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateTemplateDto, user: UserDto) {
    const template = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!template) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    const oldValueStr = JSON.stringify(template);

    template.updatedBy = user.id;
    template.updatedAt = new Date();
    if (dto.name !== undefined) {
      template.name = dto.name;
      if (
        !template.slug ||
        !enumData.THEME_CODE[dto.themeCode || template.themeCode]?.slug
      ) {
        template.slug = `${dto.name.toLowerCase().trim().replace(/\s+/g, '-')}-${Date.now()}`;
      }
    }
    if (dto.description !== undefined) template.description = dto.description;
    if (dto.tags !== undefined) template.tags = dto.tags;
    if (dto.features !== undefined) template.features = dto.features;
    if (dto.thumbnailUrl !== undefined)
      template.thumbnailUrl = dto.thumbnailUrl;
    if (dto.themeCode !== undefined) {
      template.themeCode = dto.themeCode;
      if (enumData.THEME_CODE[dto.themeCode]?.slug) {
        template.slug = enumData.THEME_CODE[dto.themeCode].slug;
      }
    }
    if (dto.isPremium !== undefined) template.isPremium = dto.isPremium;
    if (dto.minPlanId !== undefined) template.minPlanId = dto.minPlanId;
    if (dto.trialDays !== undefined) template.trialDays = dto.trialDays;

    const saved = await this.repo.save(template);
    await this.syncCardTypes(saved.id, dto.cardTypes);

    const actionLogDto: ActionLogCreateDto = {
      entityId: template.id,
      entityName: 'TemplateEntity',
      actionType: enumData.ACTION_TYPE.UPDATE.code,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.fullName || user.email,
      createdNote: `Nhân viên ${user.fullName} cập nhật template: ${template.name} `,
      oldValue: oldValueStr,
      newValue: JSON.stringify(saved),
    };

    await this.actionLogService.create(actionLogDto);
    return { message: 'Cập nhật thành công', data: saved };
  }

  async setIsShow(dto: SetIsShowTemplateDto, user: UserDto) {
    const template = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!template) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    const oldValueStr = JSON.stringify(template);

    template.isShow = dto.isShow;
    template.updatedBy = user.id;
    template.updatedAt = new Date();

    const saved = await this.repo.save(template);

    const actionLogDto: ActionLogCreateDto = {
      entityId: template.id,
      entityName: 'TemplateEntity',
      actionType: enumData.ACTION_TYPE.UPDATE.code,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.fullName || user.email,
      createdNote: `Nhân viên ${user.fullName} cập nhật trạng thái hiển thị của template: ${template.name} thành ${dto.isShow} `,
      oldValue: oldValueStr,
      newValue: JSON.stringify(saved),
    };

    await this.actionLogService.create(actionLogDto);
    return { message: 'Cập nhật thành công', data: saved };
  }

  async setPremium(dto: SetPremiumTemplateDto, user: UserDto) {
    const template = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!template) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    const oldValueStr = JSON.stringify(template);

    template.isPremium = dto.isPremium;
    template.updatedBy = user.id;
    template.updatedAt = new Date();

    const saved = await this.repo.save(template);

    const actionLogDto: ActionLogCreateDto = {
      entityId: template.id,
      entityName: 'TemplateEntity',
      actionType: enumData.ACTION_TYPE.UPDATE.code,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.fullName || user.email,
      createdNote: `Nhân viên ${user.fullName} cập nhật trạng thái premium của template: ${template.name} thành ${dto.isPremium} `,
      oldValue: oldValueStr,
      newValue: JSON.stringify(saved),
    };

    await this.actionLogService.create(actionLogDto);
    return { message: 'Cập nhật thành công', data: saved };
  }

  async setIsDeleted(dto: SetIsDeletedTemplateDto, user: UserDto) {
    const template = await this.repo.findOne({
      where: { id: dto.id },
    });
    if (!template) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    const oldValueStr = JSON.stringify(template);

    template.isDeleted = dto.isDeleted;
    template.updatedBy = user.id;
    template.updatedAt = new Date();

    const saved = await this.repo.save(template);

    const actionLogDto: ActionLogCreateDto = {
      entityId: template.id,
      entityName: 'TemplateEntity',
      actionType: enumData.ACTION_TYPE.UPDATE.code,
      createdById: user.id,
      createdByCode: user.id,
      createdByName: user.fullName || user.email,
      createdNote: `Nhân viên ${user.fullName} cập nhật trạng thái xóa của template: ${template.name} thành ${dto.isDeleted} `,
      oldValue: oldValueStr,
      newValue: JSON.stringify(saved),
    };

    await this.actionLogService.create(actionLogDto);
    return { message: 'Cập nhật thành công', data: saved };
  }

  private async syncCardTypes(templateId: string, cardTypes?: string[]) {
    if (cardTypes === undefined) return;
    await this.cardTypeRepo.delete({ templateId });
    for (const cardType of cardTypes) {
      const row = new TemplateCardTypeEntity();
      row.id = uuidv4();
      row.templateId = templateId;
      row.cardType = cardType;
      await this.cardTypeRepo.save(row);
    }
  }
}
