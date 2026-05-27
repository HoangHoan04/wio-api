import { IdDto, PaginationDto, UserDto } from '@/dto';
import { WishEntity } from '@/entities';
import { WishRepository } from '@/repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateWishDto, FilterWishDto, UpdateWishDto } from './dto';

@Injectable()
export class WishService {
  constructor(private readonly repo: WishRepository) {}

  async pagination(data: PaginationDto<FilterWishDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<WishEntity> = { isDeleted: false };

    if (where.weddingId !== undefined) whereCon.weddingId = where.weddingId;
    if (where.guestId !== undefined) whereCon.guestId = where.guestId;
    if (where.guestName !== undefined) whereCon.guestName = where.guestName;
    if (where.content !== undefined) whereCon.content = where.content;
    if (where.isApproved !== undefined) whereCon.isApproved = where.isApproved;
    if (where.isPinned !== undefined) whereCon.isPinned = where.isPinned;
    if (where.approvedAt !== undefined) whereCon.approvedAt = where.approvedAt;

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

  async create(user: UserDto, dto: CreateWishDto) {
    const entity = new WishEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.guestId !== undefined) entity.guestId = dto.guestId;
    if (dto.guestName !== undefined) entity.guestName = dto.guestName;
    if (dto.content !== undefined) entity.content = dto.content;
    if (dto.isApproved !== undefined) entity.isApproved = dto.isApproved;
    if (dto.isPinned !== undefined) entity.isPinned = dto.isPinned;
    if (dto.approvedAt !== undefined) entity.approvedAt = dto.approvedAt;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateWishDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.updatedBy = user.id;

    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.guestId !== undefined) entity.guestId = dto.guestId;
    if (dto.guestName !== undefined) entity.guestName = dto.guestName;
    if (dto.content !== undefined) entity.content = dto.content;
    if (dto.isApproved !== undefined) entity.isApproved = dto.isApproved;
    if (dto.isPinned !== undefined) entity.isPinned = dto.isPinned;
    if (dto.approvedAt !== undefined) entity.approvedAt = dto.approvedAt;

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

  async approve(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.isApproved = true;
    entity.approvedAt = new Date();
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Duyệt lời chúc thành công', data: saved };
  }

  async reject(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.isApproved = false;
    entity.approvedAt = null as any;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Từ chối lời chúc thành công', data: saved };
  }

  async pin(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.isPinned = true;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Ghim lời chúc thành công', data: saved };
  }

  async unpin(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    entity.isPinned = false;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Bỏ ghim lời chúc thành công', data: saved };
  }
}
