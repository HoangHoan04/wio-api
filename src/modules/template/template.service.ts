import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { TemplateEntity } from '@/entities';
import {
  ServicePlanRepository,
  TemplateCategoryRepository,
  TemplateRepository,
} from '@/repositories';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogCreateDto } from '../action-log/action-log.dto';
import { ActionLogService } from '../action-log/action-log.service';
import {
  CreateTemplateDto,
  FilterTemplateDto,
  SetIsDeletedTemplateDto,
  SetIsShowTemplateDto,
  SetPremiumTemplateDto,
  UpdateTemplateDto,
} from './dto';
import {
  TEMPLATE_EXCEL_DATA_SHEET,
  TEMPLATE_EXCEL_ENUM_SHEET,
  TEMPLATE_EXCEL_GUIDE_SHEET,
  TEMPLATE_EXCEL_HEADERS,
  addTemplateExcelEnumSheet,
  applyTemplateExcelEnumValidations,
  assembleCanvasPresetFromRow,
  assemblePresetTokensFromRow,
  assembleThemeLayoutFromRow,
  cellToString,
  flattenCanvasPreset,
  flattenPresetTokens,
  flattenThemeLayout,
  generateTemplateSlug,
  normalizeExcelHeader,
  normalizeTemplateFeatures,
  parseBool,
  parseIntValue,
  parseStringList,
  resolveEnumCode,
} from './template.utils';

/* ============================================================
 * RELATIONS
 * ============================================================ */
const NESTED_RELATIONS = {
  categories: true,
  minPlan: true,
} as const;

@Injectable()
export class TemplateService {
  constructor(
    private readonly repo: TemplateRepository,
    private readonly categoryRepo: TemplateCategoryRepository,
    private readonly planRepo: ServicePlanRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  /* ============================================================
   * HELPER — Log ActionLog
   * ============================================================ */
  private async logAction(
    user: UserDto,
    actionType: string,
    entity: TemplateEntity,
    note: string,
    oldValue?: any,
    newValue?: any,
  ) {
    const dto: ActionLogCreateDto = {
      entityId: entity.id,
      entityName: 'TemplateEntity',
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
   * PAGINATION
   * ============================================================ */
  async pagination(data: PaginationDto<FilterTemplateDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<TemplateEntity> = {};

    // Nếu không truyền isDeleted → mặc định false
    whereCon.isDeleted = where.isDeleted ?? false;

    if (where.id) whereCon.id = where.id;
    if (where.name) whereCon.name = ILike(`%${where.name}%`);
    if (where.themeCode) whereCon.themeCode = where.themeCode;
    if (where.slug) whereCon.slug = where.slug;
    if (where.kind) whereCon.kind = where.kind;
    if (where.weddingTheme) whereCon.weddingTheme = where.weddingTheme;
    if (where.isShow !== undefined) whereCon.isShow = where.isShow;
    if (where.isPremium !== undefined) whereCon.isPremium = where.isPremium;
    if (where.minPlanId) whereCon.minPlanId = where.minPlanId;

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: NESTED_RELATIONS,
      skip,
      take,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  /* ============================================================
   * FIND BY ID
   * ============================================================ */
  async findById(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
      relations: NESTED_RELATIONS,
    });
    if (!item) throw new NotFoundException('Không tìm thấy mẫu giao diện');
    return { message: 'Thành công', data: item };
  }

  /* ============================================================
   * INCREMENT VIEW / PREVIEW
   * ============================================================ */
  async incrementView(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!item) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    await this.repo.increment({ id: data.id }, 'viewCount', 1);

    return { message: 'Cập nhật lượt xem thành công' };
  }

  async incrementPreview(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!item) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    await this.repo.increment({ id: data.id }, 'viewCount', 1);

    return { message: 'Cập nhật lượt xem trước thành công' };
  }

  /* ============================================================
   * CREATE
   * ============================================================ */
  async create(user: UserDto, dto: CreateTemplateDto) {
    const slug = await this.ensureUniqueSlug(dto.slug || dto.name);

    const entity = this.repo.create({
      id: uuidv4(),
      name: dto.name,
      slug,
      description: dto.description,
      weddingTheme: dto.weddingTheme,
      tags: dto.tags,
      colorMood: dto.colorMood,
      features: normalizeTemplateFeatures(dto.features),
      themeLayout: dto.themeLayout,
      presetTokens: dto.presetTokens,
      thumbnailUrl: dto.thumbnailUrl,
      previewUrl: dto.previewUrl,
      themeCode: dto.themeCode,
      kind: dto.kind || enumData.TEMPLATE_KIND.CODE_THEME.code,
      canvasPreset: dto.canvasPreset,
      version: dto.version ?? 1,
      isShow: dto.isShow ?? true,
      isPremium: dto.isPremium ?? false,
      minPlanId: dto.minPlanId,
      trialDays: dto.trialDays ?? 3,
      sortOrder: dto.sortOrder ?? 0,
      viewCount: 0,
      usedCount: 0,
      createdBy: user.id,
    });

    const saved = await this.repo.save(entity);

    // Đồng bộ categories
    if (dto.categories?.length) {
      await this.syncCategories(saved.id, dto.categories);
    }

    await this.logAction(
      user,
      enumData.ACTION_TYPE.CREATE.code,
      saved,
      `Tạo mẫu giao diện: ${saved.name}`,
      undefined,
      saved,
    );

    return { message: 'Tạo template thành công', data: saved };
  }

  /* ============================================================
   * UPDATE
   * ============================================================ */
  async update(dto: UpdateTemplateDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
      relations: NESTED_RELATIONS,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    const oldValue = { ...entity };

    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.slug !== undefined) {
      entity.slug = await this.ensureUniqueSlug(dto.slug, entity.id);
    }
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.weddingTheme !== undefined) {
      entity.weddingTheme = dto.weddingTheme;
    }
    if (dto.tags !== undefined) entity.tags = dto.tags;
    if (dto.colorMood !== undefined) entity.colorMood = dto.colorMood;
    if (dto.features !== undefined) {
      entity.features = normalizeTemplateFeatures(dto.features);
    }
    if (dto.themeLayout !== undefined) entity.themeLayout = dto.themeLayout;
    if (dto.presetTokens !== undefined) entity.presetTokens = dto.presetTokens;
    if (dto.thumbnailUrl !== undefined) {
      entity.thumbnailUrl = dto.thumbnailUrl;
    }
    if (dto.previewUrl !== undefined) entity.previewUrl = dto.previewUrl;
    if (dto.themeCode !== undefined) entity.themeCode = dto.themeCode;
    if (dto.kind !== undefined) entity.kind = dto.kind;
    if (dto.canvasPreset !== undefined) entity.canvasPreset = dto.canvasPreset;
    if (dto.version !== undefined) entity.version = dto.version;
    if (dto.isShow !== undefined) entity.isShow = dto.isShow;
    if (dto.isPremium !== undefined) entity.isPremium = dto.isPremium;
    if (dto.minPlanId !== undefined) entity.minPlanId = dto.minPlanId;
    if (dto.trialDays !== undefined) entity.trialDays = dto.trialDays;
    if (dto.sortOrder !== undefined) entity.sortOrder = dto.sortOrder;

    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);

    // Đồng bộ categories nếu có
    if (dto.categories !== undefined) {
      await this.syncCategories(saved.id, dto.categories);
    }

    await this.logAction(
      user,
      enumData.ACTION_TYPE.UPDATE.code,
      saved,
      `Cập nhật mẫu giao diện: ${saved.name}`,
      oldValue,
      saved,
    );

    return { message: 'Cập nhật template thành công', data: saved };
  }

  /* ============================================================
   * SET STATUS
   * ============================================================ */
  async setIsShow(dto: SetIsShowTemplateDto, user: UserDto) {
    return this.setBooleanFlag(
      dto.id,
      'isShow',
      dto.isShow,
      user,
      `Cập nhật trạng thái hiển thị: ${dto.isShow}`,
    );
  }

  async setPremium(dto: SetPremiumTemplateDto, user: UserDto) {
    return this.setBooleanFlag(
      dto.id,
      'isPremium',
      dto.isPremium,
      user,
      `Cập nhật trạng thái premium: ${dto.isPremium}`,
    );
  }

  async setIsDeleted(dto: SetIsDeletedTemplateDto, user: UserDto) {
    return this.setBooleanFlag(
      dto.id,
      'isDeleted',
      dto.isDeleted,
      user,
      `Cập nhật trạng thái xoá: ${dto.isDeleted}`,
    );
  }

  private async setBooleanFlag(
    id: string,
    field: 'isShow' | 'isPremium' | 'isDeleted',
    value: boolean,
    user: UserDto,
    note: string,
  ) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Không tìm thấy mẫu giao diện');

    const oldValue = { [field]: entity[field] };
    entity[field] = value;
    entity.updatedBy = user.id;

    const saved = await this.repo.save(entity);

    await this.logAction(
      user,
      enumData.ACTION_TYPE.UPDATE.code,
      saved,
      note,
      oldValue,
      { [field]: value },
    );

    return { message: 'Cập nhật template thành công', data: saved };
  }

  /* ============================================================
   * PUBLIC — Danh sách template cho user
   * ============================================================ */
  async listPublic(weddingTheme?: string) {
    const where: FindOptionsWhere<TemplateEntity> = {
      isDeleted: false,
      isShow: true,
    };
    if (weddingTheme) where.weddingTheme = weddingTheme;

    const list = await this.repo.find({
      where,
      relations: NESTED_RELATIONS,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });

    return { message: 'Thành công', data: list };
  }

  /* ============================================================
   * EXCEL — Tải mẫu / Nhập / Xuất
   * ============================================================ */
  async downloadSampleExcel(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(TEMPLATE_EXCEL_DATA_SHEET);
    sheet.columns = TEMPLATE_EXCEL_HEADERS.map((col) => ({ ...col }));
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2D231F' },
    };

    sheet.addRow({
      name: 'Autumn Bloom',
      slug: 'autumn-bloom',
      description: 'Mẫu thiệp hoa khô tông nâu, phong cách boho',
      weddingTheme: enumData.WEDDING_THEME.RUSTIC.code,
      themeCode: enumData.THEME_CODE.AUTUMN_BLOOM.code,
      kind: enumData.TEMPLATE_KIND.CODE_THEME.code,
      version: 1,
      colorMood: 'ấm nâu',
      tags: 'boho, rustic, floral',
      thumbnailUrl: '',
      previewUrl: '',
      isShow: 'true',
      isPremium: 'false',
      minPlanCode: enumData.SERVICE_PLAN_CODE.FREE.code,
      trialDays: 3,
      sortOrder: 1,
      categories: `${enumData.WEDDING_THEME.RUSTIC.code}, ${enumData.WEDDING_THEME.FLORAL.code}`,
      features: 'RSVP\nAlbum ảnh\nBản đồ',
      envelopeStyle: 'classic',
      heroStyle: 'split',
      sectionOrder:
        'hero, divider, familyInfo, hosts, intro, ceremonies, countdown, gallery, partyInfo, timeline, rsvp, map, guestbook, giftBox, dressCode, thankYou',
      colorBackground: '#fbf8f3',
      colorTextPrimary: '#4a3525',
      colorTextSecondary: '#73533b',
      colorAccent: '#b87333',
      colorEnvelope: '#63452f',
      colorButtonBg: '#63452f',
      colorButtonText: '#fbf8f3',
      fontHeading: "'Playfair Display', serif",
      fontBody: "'Cormorant Garamond', serif",
      fontScript: "'Great Vibes', cursive",
      canvasBackground: '',
      canvasOpacity: '',
      canvasHeight: '',
      canvasBackgroundImage: '',
    });

    const enumRanges = addTemplateExcelEnumSheet(workbook);
    applyTemplateExcelEnumValidations(sheet, enumRanges);

    const guide = workbook.addWorksheet(TEMPLATE_EXCEL_GUIDE_SHEET);
    guide.columns = [
      { header: 'Trường', key: 'field', width: 28 },
      { header: 'Bắt buộc', key: 'required', width: 12 },
      { header: 'Ghi chú', key: 'allowed', width: 80 },
    ];
    guide.addRow({
      field: 'Các cột enum',
      required: '',
      allowed: `Copy đúng cột Mã trong sheet ${TEMPLATE_EXCEL_ENUM_SHEET}. Có thể gõ tên hiển thị.`,
    });
    guide.addRow({
      field: 'Phong cách cưới',
      required: 'Có',
      allowed: `Xem nhóm Phong cách cưới trên sheet ${TEMPLATE_EXCEL_ENUM_SHEET}`,
    });
    guide.addRow({
      field: 'Mã theme',
      required: 'Có',
      allowed: `Xem nhóm Mã theme trên sheet ${TEMPLATE_EXCEL_ENUM_SHEET}`,
    });
    guide.addRow({
      field: 'Loại mẫu',
      required: 'Không',
      allowed: `Xem nhóm Loại mẫu trên sheet ${TEMPLATE_EXCEL_ENUM_SHEET}`,
    });
    guide.addRow({
      field: 'Mã gói tối thiểu',
      required: 'Không',
      allowed: `Xem nhóm Mã gói tối thiểu trên sheet ${TEMPLATE_EXCEL_ENUM_SHEET}`,
    });
    guide.addRow({
      field: 'Danh mục',
      required: 'Không',
      allowed: 'Nhiều mã phong cách, cách nhau bởi dấu phẩy',
    });
    guide.addRow({
      field: 'Tính năng nổi bật',
      required: 'Không',
      allowed: 'Mỗi dòng một tính năng',
    });
    guide.addRow({
      field: 'Kiểu phong bì / ảnh bìa / thứ tự mục / font',
      required: 'Không',
      allowed: `Xem sheet ${TEMPLATE_EXCEL_ENUM_SHEET}`,
    });
    guide.addRow({
      field: 'Màu',
      required: 'Không',
      allowed: 'Mã hex, ví dụ #fbf8f3',
    });
    guide.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async importExcel(buffer: Buffer, user: UserDto) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);
    const worksheet =
      workbook.getWorksheet(TEMPLATE_EXCEL_DATA_SHEET) ||
      workbook.worksheets.find(
        (item) =>
          item.name !== TEMPLATE_EXCEL_ENUM_SHEET &&
          item.name !== TEMPLATE_EXCEL_GUIDE_SHEET,
      ) ||
      workbook.worksheets[0];
    if (!worksheet) {
      throw new BadRequestException('File Excel không có sheet nào');
    }

    const headerMap = new Map<number, string>();
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell, colNumber) => {
      const mapped = normalizeExcelHeader(cellToString(cell.value));
      if (mapped) headerMap.set(colNumber, mapped);
    });

    if (!headerMap.size) {
      throw new BadRequestException('Không nhận diện được tiêu đề cột Excel');
    }

    const plans = await this.planRepo.find({ where: { isDeleted: false } });
    const planByCode = new Map(plans.map((p) => [p.code.toUpperCase(), p]));
    const planById = new Map(plans.map((p) => [p.id, p]));

    const created: TemplateEntity[] = [];
    const errors: Array<{ row: number; message: string }> = [];

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      const record: Record<string, any> = {};
      headerMap.forEach((key, colNumber) => {
        record[key] = row.getCell(colNumber).value;
      });

      const name = cellToString(record.name);
      if (!name) continue;

      try {
        const weddingTheme = resolveEnumCode(
          enumData.WEDDING_THEME,
          record.weddingTheme,
        );
        if (!weddingTheme) {
          throw new Error('Thiếu hoặc sai Phong cách cưới');
        }

        const themeCode =
          resolveEnumCode(enumData.THEME_CODE, record.themeCode) ||
          cellToString(record.themeCode);
        if (!themeCode) {
          throw new Error('Thiếu Mã theme');
        }

        const kind =
          resolveEnumCode(enumData.TEMPLATE_KIND, record.kind) ||
          enumData.TEMPLATE_KIND.CODE_THEME.code;

        const minPlanRaw = cellToString(record.minPlanCode);
        let minPlanId: string | undefined;
        if (minPlanRaw) {
          const plan =
            planById.get(minPlanRaw) ||
            planByCode.get(minPlanRaw.toUpperCase());
          if (!plan) {
            throw new Error(`Không tìm thấy gói dịch vụ: ${minPlanRaw}`);
          }
          minPlanId = plan.id;
        }

        const categories = parseStringList(record.categories)
          .map((item) => resolveEnumCode(enumData.WEDDING_THEME, item))
          .filter((item): item is string => !!item);

        const entity = this.repo.create({
          id: uuidv4(),
          name,
          slug: await this.ensureUniqueSlug(
            cellToString(record.slug) || name,
          ),
          description: cellToString(record.description) || undefined,
          weddingTheme,
          themeCode,
          kind,
          version: parseIntValue(record.version, 1) ?? 1,
          colorMood: cellToString(record.colorMood) || undefined,
          tags: parseStringList(record.tags),
          thumbnailUrl: cellToString(record.thumbnailUrl) || undefined,
          previewUrl: cellToString(record.previewUrl) || undefined,
          isShow: parseBool(record.isShow, true),
          isPremium: parseBool(record.isPremium, false),
          minPlanId,
          trialDays: parseIntValue(record.trialDays, 3) ?? 3,
          sortOrder: parseIntValue(record.sortOrder, 0) ?? 0,
          features: normalizeTemplateFeatures(record.features),
          themeLayout: assembleThemeLayoutFromRow(record),
          presetTokens: assemblePresetTokensFromRow(record, themeCode),
          canvasPreset: assembleCanvasPresetFromRow(record),
          viewCount: 0,
          usedCount: 0,
          createdBy: user.id,
        });

        const saved = await this.repo.save(entity);
        if (categories.length) {
          await this.syncCategories(saved.id, categories);
        }
        created.push(saved);
      } catch (err: any) {
        errors.push({
          row: rowNumber,
          message: err?.message || 'Không nhập được dòng này',
        });
      }
    }

    if (!created.length && !errors.length) {
      throw new BadRequestException('File Excel không có dữ liệu mẫu thiệp');
    }

    if (created.length) {
      await this.logAction(
        user,
        enumData.ACTION_TYPE.IMPORT_EXCEL.code,
        created[0],
        `Nhập Excel ${created.length} mẫu thiệp`,
        undefined,
        { count: created.length },
      );
    }

    return {
      message: `Nhập thành công ${created.length} mẫu thiệp${
        errors.length ? `, lỗi ${errors.length} dòng` : ''
      }`,
      data: { created: created.length, failed: errors.length, errors },
    };
  }

  async exportExcel(filter: FilterTemplateDto = {}): Promise<Buffer> {
    const whereCon: FindOptionsWhere<TemplateEntity> = {
      isDeleted: filter.isDeleted ?? false,
    };
    if (filter.name) whereCon.name = ILike(`%${filter.name}%`);
    if (filter.themeCode) whereCon.themeCode = filter.themeCode;
    if (filter.kind) whereCon.kind = filter.kind;
    if (filter.weddingTheme) whereCon.weddingTheme = filter.weddingTheme;
    if (filter.isShow !== undefined) whereCon.isShow = filter.isShow;
    if (filter.isPremium !== undefined) whereCon.isPremium = filter.isPremium;
    if (filter.minPlanId) whereCon.minPlanId = filter.minPlanId;

    const list = await this.repo.find({
      where: whereCon,
      relations: NESTED_RELATIONS,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
      take: 5000,
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Mau thiep');
    sheet.columns = TEMPLATE_EXCEL_HEADERS.map((col) => ({ ...col }));

    for (const item of list) {
      const featureList = Array.isArray(item.features?.list)
        ? item.features.list.join('\n')
        : item.features
          ? JSON.stringify(item.features)
          : '';
      sheet.addRow({
        name: item.name,
        slug: item.slug,
        description: item.description || '',
        weddingTheme: item.weddingTheme,
        themeCode: item.themeCode,
        kind: item.kind,
        version: item.version,
        colorMood: item.colorMood || '',
        tags: (item.tags || []).join(', '),
        thumbnailUrl: item.thumbnailUrl || '',
        previewUrl: item.previewUrl || '',
        isShow: item.isShow ? 'true' : 'false',
        isPremium: item.isPremium ? 'true' : 'false',
        minPlanCode: item.minPlan?.code || '',
        trialDays: item.trialDays,
        sortOrder: item.sortOrder,
        categories: (item.categories || []).map((c) => c.category).join(', '),
        features: featureList,
        ...flattenThemeLayout(item.themeLayout),
        ...flattenPresetTokens(item.presetTokens),
        ...flattenCanvasPreset(item.canvasPreset),
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /* ============================================================
   * PRIVATE — Sync categories
   * ============================================================ */
  private async syncCategories(templateId: string, categories: string[]) {
    // Xoá cũ
    await this.categoryRepo.delete({ templateId });

    // Tạo mới
    if (!categories.length) return;

    const entities = categories.map((category) =>
      this.categoryRepo.create({
        id: uuidv4(),
        templateId,
        category,
      }),
    );

    await this.categoryRepo.save(entities);
  }

  /* ============================================================
   * PRIVATE — Generate slug
   * ============================================================ */
  private generateSlug(name: string): string {
    return generateTemplateSlug(name);
  }

  private async ensureUniqueSlug(
    input: string,
    excludeId?: string,
  ): Promise<string> {
    const base = this.generateSlug(input) || `template-${Date.now()}`;
    let slug = base;
    let n = 1;
    while (true) {
      const existing = await this.repo.findOne({
        where: { slug, isDeleted: false },
      });
      if (!existing || existing.id === excludeId) return slug;
      n += 1;
      slug = `${base.slice(0, 90)}-${n}`;
    }
  }
}
