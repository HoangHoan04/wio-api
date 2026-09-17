import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { WishEntity } from '@/entities';
import {
  GuestRepository,
  InvitationRepository,
  WishRepository,
} from '@/repositories';
import {
  assertInvitationModule,
  assertPublishedInvitation,
} from '@/utils/invitation.utils';
import { isAdminUser } from '@/utils/owner.utils';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateWishDto,
  FilterWishDto,
  PublicCreateWishDto,
  PublicWishListDto,
  UpdateWishDto,
} from './dto';

@Injectable()
export class WishService {
  constructor(
    private readonly repo: WishRepository,
    private readonly invitationRepo: InvitationRepository,
    private readonly guestRepo: GuestRepository,
  ) {}

  /* ============================================================
   * HELPER — Assert ownership
   * ============================================================ */
  private async assertInvitationOwnership(
    invitationId: string,
    user: UserDto,
    action: string,
  ) {
    const invitation = await this.invitationRepo.findOne({
      where: { id: invitationId, isDeleted: false },
    });
    if (!invitation) throw new NotFoundException('Không tìm thấy thiệp');

    if (!isAdminUser(user) && invitation.userId !== user.id) {
      throw new ForbiddenException(`Bạn không có quyền ${action}`);
    }
    return invitation;
  }

  private async requireOwnedWish(id: string, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: { invitation: true },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy lời chúc');

    if (!isAdminUser(user) && entity.invitation?.userId !== user.id) {
      throw new ForbiddenException(
        'Bạn không có quyền thao tác với lời chúc này',
      );
    }
    return entity;
  }

  /* ============================================================
   * HELPER — Build where
   * ============================================================ */
  private buildWhere(filter: FilterWishDto): FindOptionsWhere<WishEntity> {
    const where: FindOptionsWhere<WishEntity> = { isDeleted: false };

    if (filter.invitationId) where.invitationId = filter.invitationId;
    if (filter.guestId) where.guestId = filter.guestId;
    if (filter.guestName) where.guestName = ILike(`%${filter.guestName}%`);
    if (filter.isApproved !== undefined) where.isApproved = filter.isApproved;
    if (filter.isPinned !== undefined) where.isPinned = filter.isPinned;

    return where;
  }

  /* ============================================================
   * PAGINATION — Admin (toàn hệ thống)
   * ============================================================ */
  async pagination(data: PaginationDto<FilterWishDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon = this.buildWhere(where);

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: { guest: true },
      skip,
      take,
      order: { isPinned: 'DESC', createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  /* ============================================================
   * PAGINATION — User (chỉ lời chúc thuộc thiệp mình sở hữu)
   * ============================================================ */
  async paginationForUser(data: PaginationDto<FilterWishDto>, user: UserDto) {
    const { skip = 0, take = 10, where = {} } = data;

    // Nếu filter theo 1 thiệp → check quyền
    if (where.invitationId) {
      await this.assertInvitationOwnership(
        where.invitationId,
        user,
        'xem lời chúc của thiệp này',
      );

      const whereCon = this.buildWhere(where);
      const [list, total] = await this.repo.findAndCount({
        where: whereCon,
        relations: { guest: true },
        skip,
        take,
        order: { isPinned: 'DESC', createdAt: 'DESC' },
      });
      return { data: list, total };
    }

    // Không filter thiệp → lấy hết của user
    const invitations = await this.invitationRepo.find({
      where: { userId: user.id, isDeleted: false },
      select: { id: true },
    });
    if (!invitations.length) return { data: [], total: 0 };

    const whereCon = this.buildWhere(where);
    whereCon.invitationId = In(invitations.map((i) => i.id));

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: { guest: true },
      skip,
      take,
      order: { isPinned: 'DESC', createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  /* ============================================================
   * PUBLIC — Danh sách lời chúc đã duyệt
   * ============================================================ */
  async listPublic(query: PublicWishListDto) {
    const invitation = await this.invitationRepo.findOne({
      where: { id: query.invitationId, isDeleted: false },
    });
    assertPublishedInvitation(invitation);
    assertInvitationModule(
      invitation!,
      enumData.INVITATION_MODULE.GUESTBOOK.code,
      'Thiệp này không bật sổ lời chúc',
    );

    const [list, total] = await this.repo.findAndCount({
      where: {
        invitationId: query.invitationId,
        isApproved: true,
        isDeleted: false,
      },
      relations: { guest: true },
      skip: query.skip ?? 0,
      take: query.take ?? 20,
      order: { isPinned: 'DESC', createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  /* ============================================================
   * FIND BY ID
   * ============================================================ */
  async findById(data: IdDto, user?: UserDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
      relations: { guest: true, invitation: true },
    });
    if (!item) throw new NotFoundException('Không tìm thấy lời chúc');

    if (user && !isAdminUser(user)) {
      await this.assertInvitationOwnership(
        item.invitationId,
        user,
        'xem lời chúc này',
      );
    }

    return { message: 'Thành công', data: item };
  }

  /* ============================================================
   * CREATE — Admin
   * ============================================================ */
  async create(user: UserDto, dto: CreateWishDto) {
    await this.assertInvitationOwnership(
      dto.invitationId,
      user,
      'tạo lời chúc cho thiệp này',
    );

    const entity = this.repo.create({
      id: uuidv4(),
      invitationId: dto.invitationId,
      guestId: dto.guestId,
      guestName: dto.guestName,
      content: dto.content,
      isApproved: dto.isApproved ?? false,
      isPinned: dto.isPinned ?? false,
      approvedAt: dto.isApproved ? new Date() : undefined,
      createdBy: user.id,
    });

    const saved = await this.repo.save(entity);
    return { message: 'Tạo lời chúc thành công', data: saved };
  }

  /* ============================================================
   * CREATE — Public (khách gửi)
   * ============================================================ */
  async createPublic(dto: PublicCreateWishDto) {
    const invitation = await this.invitationRepo.findOne({
      where: { id: dto.invitationId, isDeleted: false },
    });
    assertPublishedInvitation(invitation);
    assertInvitationModule(
      invitation!,
      enumData.INVITATION_MODULE.GUESTBOOK.code,
      'Thiệp này không bật sổ lời chúc',
    );

    // Tìm guest theo invitationCode (nếu có)
    let guestId: string | undefined;
    if (dto.invitationCode) {
      const guest = await this.guestRepo.findOne({
        where: {
          invitationCode: dto.invitationCode,
          isDeleted: false,
        },
        select: { id: true, invitationId: true },
      });
      if (guest && guest.invitationId === dto.invitationId) {
        guestId = guest.id;
      }
    }

    const entity = this.repo.create({
      id: uuidv4(),
      invitationId: dto.invitationId,
      guestId,
      guestName: dto.guestName.trim(),
      content: dto.content.trim(),
      isApproved: true, // tự động duyệt
      isPinned: false,
      approvedAt: new Date(),
    });

    const saved = await this.repo.save(entity);
    return { message: 'Gửi lời chúc thành công', data: saved };
  }

  /* ============================================================
   * UPDATE
   * ============================================================ */
  async update(dto: UpdateWishDto, user: UserDto) {
    const entity = await this.requireOwnedWish(dto.id, user);

    if (dto.guestName !== undefined) entity.guestName = dto.guestName;
    if (dto.content !== undefined) entity.content = dto.content;
    if (dto.isApproved !== undefined) {
      entity.isApproved = dto.isApproved;
      entity.approvedAt = dto.isApproved ? new Date() : undefined;
    }
    if (dto.isPinned !== undefined) entity.isPinned = dto.isPinned;

    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật lời chúc thành công', data: saved };
  }

  /* ============================================================
   * DELETE (soft)
   * ============================================================ */
  async delete(data: IdDto, user: UserDto) {
    const entity = await this.requireOwnedWish(data.id, user);
    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xoá lời chúc thành công' };
  }

  /* ============================================================
   * APPROVE / REJECT
   * ============================================================ */
  async approve(data: IdDto, user: UserDto) {
    return this.setApproval(data.id, true, user);
  }

  async reject(data: IdDto, user: UserDto) {
    return this.setApproval(data.id, false, user);
  }

  private async setApproval(id: string, isApproved: boolean, user: UserDto) {
    const entity = await this.requireOwnedWish(id, user);
    entity.isApproved = isApproved;
    entity.approvedAt = isApproved ? new Date() : undefined;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return {
      message: isApproved
        ? 'Duyệt lời chúc thành công'
        : 'Từ chối lời chúc thành công',
      data: saved,
    };
  }

  /* ============================================================
   * PIN / UNPIN
   * ============================================================ */
  async pin(data: IdDto, user: UserDto) {
    return this.setPinned(data.id, true, user);
  }

  async unpin(data: IdDto, user: UserDto) {
    return this.setPinned(data.id, false, user);
  }

  private async setPinned(id: string, isPinned: boolean, user: UserDto) {
    const entity = await this.requireOwnedWish(id, user);
    entity.isPinned = isPinned;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return {
      message: isPinned
        ? 'Ghim lời chúc thành công'
        : 'Bỏ ghim lời chúc thành công',
      data: saved,
    };
  }
}
