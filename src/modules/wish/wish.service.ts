import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { WishEntity } from '@/entities';
import { InvitationRepository, WishRepository } from '@/repositories';
import {
  assertInvitationModule,
  assertPublishedInvitation,
} from '@/utils/invitation.utils';
import { assertOwner, isAdminUser } from '@/utils/owner.utils';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FindOptionsWhere, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateWishDto, FilterWishDto, UpdateWishDto } from './dto';

@Injectable()
export class WishService {
  constructor(
    private readonly repo: WishRepository,
    private readonly invitationRepo: InvitationRepository,
  ) {}

  async pagination(data: PaginationDto<FilterWishDto>, user?: UserDto) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<WishEntity> = { isDeleted: false };

    if (user && !isAdminUser(user)) {
      if (where.invitationId) {
        const invitation = await this.invitationRepo.findOne({
          where: { id: where.invitationId, isDeleted: false },
        });
        if (!invitation) throw new NotFoundException('Không tìm thấy thiệp');
        assertOwner(
          user,
          invitation.userId,
          'Bạn không có quyền xem lời chúc của thiệp này',
        );
      } else {
        const invitations = await this.invitationRepo.find({
          where: { userId: user.id, isDeleted: false },
          select: ['id'],
        });
        const ids = invitations.map((item) => item.id);
        if (!ids.length) return { data: [], total: 0 };
        whereCon.invitationId = In(ids) as any;
      }
    }

    if (where.invitationId !== undefined) whereCon.invitationId = where.invitationId;
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
      order: { createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  async listPublic(data: PaginationDto<FilterWishDto>) {
    const invitationId = data.where?.invitationId;
    if (!invitationId) {
      throw new BadRequestException('Thiếu invitationId');
    }
    const invitation = await this.invitationRepo.findOne({
      where: { id: invitationId, isDeleted: false },
    });
    assertPublishedInvitation(invitation);
    assertInvitationModule(
      invitation!,
      enumData.INVITATION_MODULE.GUESTBOOK.code,
      'Thiệp này không bật sổ lời chúc',
    );
    return this.pagination({
      skip: data.skip,
      take: data.take,
      where: { invitationId, isApproved: true },
    });
  }

  async findById(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!item) throw new NotFoundException('Không tìm thấy bản ghi');
    return { message: 'Thành công', data: item };
  }

  async create(user: UserDto, dto: CreateWishDto) {
    const entity = new WishEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.invitationId !== undefined) entity.invitationId = dto.invitationId;
    if (dto.guestId !== undefined) entity.guestId = dto.guestId;
    if (dto.guestName !== undefined) entity.guestName = dto.guestName;
    if (dto.content !== undefined) entity.content = dto.content;
    if (dto.isApproved !== undefined) entity.isApproved = dto.isApproved;
    if (dto.isPinned !== undefined) entity.isPinned = dto.isPinned;
    if (dto.approvedAt !== undefined) entity.approvedAt = dto.approvedAt;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async createPublic(dto: CreateWishDto) {
    const invitation = await this.invitationRepo.findOne({
      where: { id: dto.invitationId, isDeleted: false },
    });
    assertPublishedInvitation(invitation);
    assertInvitationModule(
      invitation!,
      enumData.INVITATION_MODULE.GUESTBOOK.code,
      'Thiệp này không bật sổ lời chúc',
    );

    const entity = new WishEntity();
    entity.id = uuidv4();
    entity.invitationId = dto.invitationId;
    entity.guestId = dto.guestId;
    entity.guestName = dto.guestName;
    entity.content = dto.content;
    entity.isApproved = dto.isApproved ?? true;
    entity.isPinned = false;
    const saved = await this.repo.save(entity);
    return { message: 'Gửi lời chúc thành công', data: saved };
  }

  async update(dto: UpdateWishDto, user: UserDto) {
    const entity = await this.requireOwnedWish(dto.id, user);
    entity.updatedBy = user.id;

    if (dto.invitationId !== undefined) entity.invitationId = dto.invitationId;
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
    const entity = await this.requireOwnedWish(data.id, user);
    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xóa thành công' };
  }

  async approve(data: IdDto, user: UserDto) {
    const entity = await this.requireOwnedWish(data.id, user);
    entity.isApproved = true;
    entity.approvedAt = new Date();
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Duyệt lời chúc thành công', data: saved };
  }

  async reject(data: IdDto, user: UserDto) {
    const entity = await this.requireOwnedWish(data.id, user);
    entity.isApproved = false;
    entity.approvedAt = null as any;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Từ chối lời chúc thành công', data: saved };
  }

  async pin(data: IdDto, user: UserDto) {
    const entity = await this.requireOwnedWish(data.id, user);
    entity.isPinned = true;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Ghim lời chúc thành công', data: saved };
  }

  async unpin(data: IdDto, user: UserDto) {
    const entity = await this.requireOwnedWish(data.id, user);
    entity.isPinned = false;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Bỏ ghim lời chúc thành công', data: saved };
  }

  private async requireOwnedWish(id: string, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');
    const invitation = await this.invitationRepo.findOne({
      where: { id: entity.invitationId, isDeleted: false },
    });
    if (!invitation) throw new NotFoundException('Không tìm thấy thiệp');
    assertOwner(
      user,
      invitation.userId,
      'Bạn không có quyền thực hiện thao tác này',
    );
    return entity;
  }
}
