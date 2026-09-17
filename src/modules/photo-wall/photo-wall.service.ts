import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { PhotoWallEntity } from '@/entities';
import {
  GuestRepository,
  InvitationRepository,
  PhotoWallRepository,
} from '@/repositories';
import {
  assertInvitationModule,
  assertPublishedInvitation,
} from '@/utils/invitation.utils';
import { isAdminUser } from '@/utils/owner.utils';
import { getActivePlanLimits } from '@/utils/quota.utils';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreatePhotoWallDto,
  FilterPhotoWallDto,
  PublicUploadPhotoWallDto,
  UpdatePhotoWallDto,
} from './dto';

@Injectable()
export class PhotoWallService {
  constructor(
    private readonly repo: PhotoWallRepository,
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

  private async requireOwnedPhoto(id: string, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy ảnh');

    await this.assertInvitationOwnership(
      entity.invitationId,
      user,
      'thực hiện thao tác này',
    );

    return entity;
  }

  /* ============================================================
   * HELPER — Build where
   * ============================================================ */
  private buildWhere(
    filter: FilterPhotoWallDto,
  ): FindOptionsWhere<PhotoWallEntity> {
    const where: FindOptionsWhere<PhotoWallEntity> = { isDeleted: false };

    if (filter.invitationId) where.invitationId = filter.invitationId;
    if (filter.guestId) where.guestId = filter.guestId;
    if (filter.uploaderName) {
      where.uploaderName = ILike(`%${filter.uploaderName}%`);
    }
    if (filter.isApproved !== undefined) where.isApproved = filter.isApproved;

    return where;
  }

  /* ============================================================
   * PAGINATION — Admin (xem hết)
   * ============================================================ */
  async pagination(data: PaginationDto<FilterPhotoWallDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon = this.buildWhere(where);

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: { invitation: false, guest: false },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  /* ============================================================
   * PAGINATION — User (chỉ ảnh thuộc thiệp của mình)
   * ============================================================ */
  async paginationForUser(
    data: PaginationDto<FilterPhotoWallDto>,
    user: UserDto,
  ) {
    const { skip = 0, take = 10, where = {} } = data;

    if (where.invitationId) {
      await this.assertInvitationOwnership(
        where.invitationId,
        user,
        'xem ảnh của thiệp này',
      );
      const whereCon = this.buildWhere(where);
      const [list, total] = await this.repo.findAndCount({
        where: whereCon,
        skip,
        take,
        order: { createdAt: 'DESC' },
      });
      return { data: list, total };
    }

    const invitations = await this.invitationRepo.find({
      where: { userId: user.id, isDeleted: false },
      select: { id: true },
    });
    if (!invitations.length) return { data: [], total: 0 };

    const whereCon = this.buildWhere(where);
    whereCon.invitationId = In(invitations.map((i) => i.id));

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
    return { data: list, total };
  }

  /* ============================================================
   * FIND BY ID
   * ============================================================ */
  async findById(data: IdDto, user?: UserDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
      relations: { guest: true },
    });
    if (!item) throw new NotFoundException('Không tìm thấy ảnh');

    if (user && !isAdminUser(user)) {
      await this.assertInvitationOwnership(
        item.invitationId,
        user,
        'xem ảnh này',
      );
    }

    return { message: 'Thành công', data: item };
  }

  /* ============================================================
   * CREATE — Admin
   * ============================================================ */
  async create(user: UserDto, dto: CreatePhotoWallDto) {
    await this.assertInvitationOwnership(
      dto.invitationId,
      user,
      'tạo ảnh cho thiệp này',
    );

    const entity = this.repo.create({
      id: uuidv4(),
      invitationId: dto.invitationId,
      guestId: dto.guestId,
      uploaderName: dto.uploaderName,
      url: dto.url,
      storageKey: dto.storageKey,
      caption: dto.caption,
      isApproved: dto.isApproved ?? false,
      approvedAt: dto.isApproved ? new Date() : undefined,
      createdBy: user.id,
    });

    const saved = await this.repo.save(entity);
    return { message: 'Tạo ảnh thành công', data: saved };
  }

  /* ============================================================
   * CREATE — Public (khách upload)
   * ============================================================ */
  async createPublic(dto: PublicUploadPhotoWallDto) {
    const invitation = await this.invitationRepo.findOne({
      where: { id: dto.invitationId, isDeleted: false },
    });
    assertPublishedInvitation(invitation);
    assertInvitationModule(
      invitation!,
      enumData.INVITATION_MODULE.PHOTO_WALL.code,
      'Thiệp này không bật tường ảnh',
    );

    // Kiểm tra quota
    const { maxPhotos } = await getActivePlanLimits(
      this.repo.manager,
      invitation!.userId,
    );
    const count = await this.repo.count({
      where: { invitationId: dto.invitationId, isDeleted: false },
    });
    if (count >= maxPhotos) {
      throw new ForbiddenException(
        `Gói hiện tại cho phép tối đa ${maxPhotos} ảnh`,
      );
    }

    // Tìm guest theo invitationCode (nếu có) để liên kết
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
      uploaderName: dto.uploaderName,
      url: dto.url,
      storageKey: dto.storageKey,
      caption: dto.caption,
      isApproved: false,
    });

    const saved = await this.repo.save(entity);
    return { message: 'Tải ảnh thành công, chờ duyệt', data: saved };
  }

  /* ============================================================
   * UPDATE
   * ============================================================ */
  async update(dto: UpdatePhotoWallDto, user: UserDto) {
    const entity = await this.requireOwnedPhoto(dto.id, user);

    if (dto.uploaderName !== undefined) entity.uploaderName = dto.uploaderName;
    if (dto.url !== undefined) entity.url = dto.url;
    if (dto.storageKey !== undefined) entity.storageKey = dto.storageKey;
    if (dto.caption !== undefined) entity.caption = dto.caption;
    if (dto.isApproved !== undefined) {
      entity.isApproved = dto.isApproved;
      entity.approvedAt = dto.isApproved ? new Date() : undefined;
    }

    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật ảnh thành công', data: saved };
  }

  /* ============================================================
   * DELETE (soft)
   * ============================================================ */
  async delete(data: IdDto, user: UserDto) {
    const entity = await this.requireOwnedPhoto(data.id, user);
    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xoá ảnh thành công' };
  }

  /* ============================================================
   * APPROVE
   * ============================================================ */
  async approve(data: IdDto, user: UserDto) {
    const entity = await this.requireOwnedPhoto(data.id, user);
    entity.isApproved = true;
    entity.approvedAt = new Date();
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Duyệt ảnh thành công', data: saved };
  }

  /* ============================================================
   * REJECT
   * ============================================================ */
  async reject(data: IdDto, user: UserDto) {
    const entity = await this.requireOwnedPhoto(data.id, user);
    entity.isApproved = false;
    entity.approvedAt = undefined;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Từ chối duyệt ảnh thành công', data: saved };
  }

  /* ============================================================
   * PUBLIC — Lấy danh sách ảnh đã duyệt của thiệp
   * ============================================================ */
  async listApprovedByInvitation(invitationId: string) {
    const list = await this.repo.find({
      where: {
        invitationId,
        isApproved: true,
        isDeleted: false,
      },
      order: { approvedAt: 'DESC' },
    });
    return { message: 'Thành công', data: list };
  }
}
