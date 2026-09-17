import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { ReviewEntity } from '@/entities';
import { ReviewRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Between,
  FindOptionsWhere,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateReviewDto,
  FilterReviewDto,
  PublicCreateReviewDto,
  PublicReviewListDto,
  UpdateReviewDto,
} from './dto';

@Injectable()
export class ReviewService {
  constructor(private readonly repo: ReviewRepository) {}

  /* ============================================================
   * PUBLIC — Danh sách đánh giá đã duyệt
   * ============================================================ */
  async listPublic(query: PublicReviewListDto = {}) {
    const where: FindOptionsWhere<ReviewEntity> = {
      isDeleted: false,
      status: enumData.REVIEW_STATUS.APPROVED.code,
    };

    if (query.weddingTheme) where.weddingTheme = query.weddingTheme;
    if (query.ratingMin) where.rating = MoreThanOrEqual(query.ratingMin);

    const list = await this.repo.find({
      where,
      order: {
        isPinned: 'DESC',
        sortOrder: 'ASC',
        createdAt: 'DESC',
      },
      take: query.take ?? 6,
      select: {
        id: true,
        authorName: true,
        content: true,
        rating: true,
        eventLabel: true,
        avatarUrl: true,
        weddingTheme: true,
      },
    });

    return { message: 'Thành công', data: list };
  }

  /* ============================================================
   * PUBLIC — Khách gửi đánh giá
   * ============================================================ */
  async createPublic(dto: PublicCreateReviewDto) {
    const entity = this.repo.create({
      id: uuidv4(),
      authorName: dto.authorName.trim(),
      content: dto.content.trim(),
      rating: dto.rating,
      eventLabel: dto.eventLabel?.trim(),
      weddingTheme: dto.weddingTheme,
      invitationId: dto.invitationId,
      status: enumData.REVIEW_STATUS.PENDING.code,
      isPinned: false,
      sortOrder: 0,
    });

    const saved = await this.repo.save(entity);

    return {
      message:
        'Cảm ơn bạn đã gửi đánh giá. Chúng tôi sẽ duyệt trước khi hiển thị.',
      data: { id: saved.id },
    };
  }

  /* ============================================================
   * ADMIN — Pagination
   * ============================================================ */
  async pagination(data: PaginationDto<FilterReviewDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<ReviewEntity> = { isDeleted: false };

    if (where.authorName) whereCon.authorName = ILike(`%${where.authorName}%`);
    if (where.invitationId) whereCon.invitationId = where.invitationId;
    if (where.userId) whereCon.userId = where.userId;
    if (where.weddingTheme) whereCon.weddingTheme = where.weddingTheme;
    if (where.status) whereCon.status = where.status;
    if (where.isPinned !== undefined) whereCon.isPinned = where.isPinned;

    // Rating range
    if (where.ratingMin && where.ratingMax) {
      whereCon.rating = Between(where.ratingMin, where.ratingMax);
    } else if (where.ratingMin) {
      whereCon.rating = MoreThanOrEqual(where.ratingMin);
    } else if (where.ratingMax) {
      whereCon.rating = LessThanOrEqual(where.ratingMax);
    }

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: {
        isPinned: 'DESC',
        sortOrder: 'ASC',
        createdAt: 'DESC',
      },
    });

    return { data: list, total };
  }

  /* ============================================================
   * ADMIN — Find by id
   * ============================================================ */
  async findById(data: IdDto) {
    const item = await this.requireOne(data.id);
    return { message: 'Thành công', data: item };
  }

  /* ============================================================
   * ADMIN — Create
   * ============================================================ */
  async create(user: UserDto, dto: CreateReviewDto) {
    const entity = this.repo.create({
      id: uuidv4(),
      authorName: dto.authorName.trim(),
      content: dto.content.trim(),
      rating: dto.rating,
      eventLabel: dto.eventLabel?.trim(),
      avatarUrl: dto.avatarUrl,
      weddingTheme: dto.weddingTheme,
      invitationId: dto.invitationId,
      userId: dto.userId,
      status: dto.status || enumData.REVIEW_STATUS.APPROVED.code,
      isPinned: dto.isPinned ?? false,
      sortOrder: dto.sortOrder ?? 0,
      createdBy: user.id,
    });

    const saved = await this.repo.save(entity);
    return { message: 'Tạo đánh giá thành công', data: saved };
  }

  /* ============================================================
   * ADMIN — Update
   * ============================================================ */
  async update(dto: UpdateReviewDto, user: UserDto) {
    const entity = await this.requireOne(dto.id);

    if (dto.authorName !== undefined) {
      entity.authorName = dto.authorName.trim();
    }
    if (dto.content !== undefined) entity.content = dto.content.trim();
    if (dto.rating !== undefined) entity.rating = dto.rating;
    if (dto.eventLabel !== undefined) {
      entity.eventLabel = dto.eventLabel?.trim();
    }
    if (dto.avatarUrl !== undefined) entity.avatarUrl = dto.avatarUrl;
    if (dto.weddingTheme !== undefined) {
      entity.weddingTheme = dto.weddingTheme;
    }
    if (dto.invitationId !== undefined) {
      entity.invitationId = dto.invitationId;
    }
    if (dto.userId !== undefined) entity.userId = dto.userId;
    if (dto.status !== undefined) entity.status = dto.status;
    if (dto.isPinned !== undefined) entity.isPinned = dto.isPinned;
    if (dto.sortOrder !== undefined) entity.sortOrder = dto.sortOrder;

    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật đánh giá thành công', data: saved };
  }

  /* ============================================================
   * ADMIN — Delete (soft)
   * ============================================================ */
  async delete(data: IdDto, user: UserDto) {
    const entity = await this.requireOne(data.id);
    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xoá đánh giá thành công' };
  }

  /* ============================================================
   * ADMIN — Approve / Reject
   * ============================================================ */
  async approve(data: IdDto, user: UserDto) {
    return this.setStatus(data.id, enumData.REVIEW_STATUS.APPROVED.code, user);
  }

  async reject(data: IdDto, user: UserDto) {
    return this.setStatus(data.id, enumData.REVIEW_STATUS.REJECTED.code, user);
  }

  private async setStatus(id: string, status: string, user: UserDto) {
    const entity = await this.requireOne(id);
    entity.status = status;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật trạng thái thành công', data: saved };
  }

  /* ============================================================
   * ADMIN — Pin / Unpin
   * ============================================================ */
  async pin(data: IdDto, user: UserDto) {
    return this.setPinned(data.id, true, user);
  }

  async unpin(data: IdDto, user: UserDto) {
    return this.setPinned(data.id, false, user);
  }

  private async setPinned(id: string, isPinned: boolean, user: UserDto) {
    const entity = await this.requireOne(id);
    entity.isPinned = isPinned;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return {
      message: isPinned ? 'Đã ghim đánh giá' : 'Đã bỏ ghim đánh giá',
      data: saved,
    };
  }

  /* ============================================================
   * PRIVATE — Helper
   * ============================================================ */
  private async requireOne(id: string) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy đánh giá');
    return entity;
  }
}
