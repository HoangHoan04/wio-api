import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { ReviewEntity } from '@/entities';
import { ReviewRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';
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

  async listPublic(query: PublicReviewListDto = {}) {
    const take = query.take ?? 6;
    const [list] = await this.repo.findAndCount({
      where: {
        isDeleted: false,
        status: enumData.REVIEW_STATUS.APPROVED.code,
      },
      order: { isPinned: 'DESC', sortOrder: 'ASC', createdAt: 'DESC' },
      take,
    });

    return {
      message: 'Thành công',
      data: list.map((item) => ({
        id: item.id,
        authorName: item.authorName,
        content: item.content,
        rating: Math.min(5, Math.max(1, Number(item.rating) || 5)),
        eventLabel: item.eventLabel || '',
        avatarUrl: item.avatarUrl || '',
        cardType: item.cardType || '',
      })),
    };
  }

  async createPublic(dto: PublicCreateReviewDto) {
    const entity = new ReviewEntity();
    entity.id = uuidv4();
    entity.authorName = dto.authorName.trim();
    entity.content = dto.content.trim();
    entity.rating = dto.rating;
    entity.eventLabel = dto.eventLabel?.trim() || undefined;
    entity.cardType = dto.cardType;
    entity.status = enumData.REVIEW_STATUS.PENDING.code;
    entity.isPinned = false;
    entity.sortOrder = 0;
    const saved = await this.repo.save(entity);
    return {
      message: 'Cảm ơn bạn đã gửi đánh giá. Chúng tôi sẽ duyệt trước khi hiển thị.',
      data: { id: saved.id },
    };
  }

  async pagination(data: PaginationDto<FilterReviewDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<ReviewEntity> = { isDeleted: false };

    if (where.authorName !== undefined) {
      whereCon.authorName = ILike(`%${where.authorName}%`);
    }
    if (where.status !== undefined) whereCon.status = where.status;
    if (where.cardType !== undefined) whereCon.cardType = where.cardType;
    if (where.isPinned !== undefined) whereCon.isPinned = where.isPinned;

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
    if (!item) throw new NotFoundException('Không tìm thấy đánh giá');
    return { message: 'Thành công', data: item };
  }

  async create(user: UserDto, dto: CreateReviewDto) {
    const entity = new ReviewEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;
    this.assign(entity, dto);
    entity.status = dto.status || enumData.REVIEW_STATUS.APPROVED.code;
    entity.isPinned = dto.isPinned ?? false;
    entity.sortOrder = dto.sortOrder ?? 0;
    const saved = await this.repo.save(entity);
    return { message: 'Tạo đánh giá thành công', data: saved };
  }

  async update(dto: UpdateReviewDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy đánh giá');
    entity.updatedBy = user.id;
    this.assign(entity, dto);
    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật thành công', data: saved };
  }

  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy đánh giá');
    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xóa thành công' };
  }

  async approve(data: IdDto, user: UserDto) {
    return this.setStatus(data.id, enumData.REVIEW_STATUS.APPROVED.code, user);
  }

  async reject(data: IdDto, user: UserDto) {
    return this.setStatus(data.id, enumData.REVIEW_STATUS.REJECTED.code, user);
  }

  async pin(data: IdDto, user: UserDto) {
    const entity = await this.requireOne(data.id);
    entity.isPinned = true;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Đã ghim đánh giá', data: saved };
  }

  async unpin(data: IdDto, user: UserDto) {
    const entity = await this.requireOne(data.id);
    entity.isPinned = false;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Đã bỏ ghim đánh giá', data: saved };
  }

  private async setStatus(id: string, status: string, user: UserDto) {
    const entity = await this.requireOne(id);
    entity.status = status;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật trạng thái thành công', data: saved };
  }

  private async requireOne(id: string) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy đánh giá');
    return entity;
  }

  private assign(entity: ReviewEntity, dto: Partial<CreateReviewDto>) {
    if (dto.authorName !== undefined) entity.authorName = dto.authorName.trim();
    if (dto.content !== undefined) entity.content = dto.content.trim();
    if (dto.rating !== undefined) entity.rating = dto.rating;
    if (dto.eventLabel !== undefined) entity.eventLabel = dto.eventLabel?.trim();
    if (dto.avatarUrl !== undefined) entity.avatarUrl = dto.avatarUrl;
    if (dto.cardType !== undefined) entity.cardType = dto.cardType;
    if (dto.invitationId !== undefined) entity.invitationId = dto.invitationId;
    if (dto.isPinned !== undefined) entity.isPinned = dto.isPinned;
    if (dto.sortOrder !== undefined) entity.sortOrder = dto.sortOrder;
    if (dto.status !== undefined) entity.status = dto.status;
  }
}
