import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { TemplateCategoryEntity } from '@/entities';
import { TemplateCategoryRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TemplateCategoryService {
  constructor(private readonly repo: TemplateCategoryRepository) {}

  /* ============================================================
   * PUBLIC — Danh sách phong cách cưới (đang active)
   * ============================================================ */
  async listActive() {
    const list = await this.repo.find({
      where: { isDeleted: false },
      order: { sortOrder: 'ASC' },
    });

    if (list.length) return { data: list };

    // Fallback: trả từ enum nếu DB chưa có
    return { data: this.fromEnum() };
  }

  /* ============================================================
   * ADMIN — Pagination
   * ============================================================ */
  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<TemplateCategoryEntity> = {
      isDeleted: false,
    };

    if (data.where?.category) {
      whereCon.category = ILike(`%${data.where.category}%`);
    }
    if (data.where?.templateId) {
      whereCon.templateId = data.where.templateId;
    }

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { category: 'ASC' },
    });

    const fallback = this.fromEnum();
    return {
      data: list.length ? list : fallback,
      total: total || fallback.length,
    };
  }

  /* ============================================================
   * ADMIN — Chi tiết
   * ============================================================ */
  async findById(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
      relations: { template: true },
    });
    if (!item) {
      throw new NotFoundException('Không tìm thấy phong cách cưới');
    }
    return { message: 'Thành công', data: item };
  }

  /* ============================================================
   * ADMIN — Sync từ enum WEDDING_THEME
   * Tạo bản ghi mẫu cho mỗi phong cách cưới (templateId = null)
   * ============================================================ */
  async syncFromEnum(user: UserDto) {
    const existing = await this.repo.find({
      where: { isDeleted: false, templateId: null as any },
    });
    const byCategory = new Map(existing.map((item) => [item.category, item]));

    const saved: TemplateCategoryEntity[] = [];

    for (const themeCode of Object.keys(enumData.WEDDING_THEME)) {
      const theme = enumData.WEDDING_THEME[themeCode];
      const current =
        byCategory.get(theme.code) || new TemplateCategoryEntity();

      if (!current.id) {
        current.id = uuidv4();
        current.createdBy = user.id;
      }

      current.category = theme.code;
      current.updatedBy = user.id;

      saved.push(await this.repo.save(current));
    }

    return { message: 'Đồng bộ phong cách cưới thành công', data: saved };
  }

  /* ============================================================
   * HELPER — Map enum WEDDING_THEME thành entity tạm
   * ============================================================ */
  private fromEnum(): Partial<TemplateCategoryEntity>[] {
    return Object.values(enumData.WEDDING_THEME).map((item) => ({
      id: item.code, // chỉ dùng làm fallback, không lưu DB
      category: item.code,
      templateId: '',
    })) as Partial<TemplateCategoryEntity>[];
  }
}
