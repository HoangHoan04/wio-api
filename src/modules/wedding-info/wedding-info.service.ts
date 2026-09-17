import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { WeddingInfoEntity } from '@/entities';
import { InvitationRepository, WeddingInfoRepository } from '@/repositories';
import { isAdminUser } from '@/utils/owner.utils';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateWeddingInfoDto,
  FilterWeddingInfoDto,
  UpdateWeddingInfoDto,
  WeddingInfoDto,
} from './dto';

@Injectable()
export class WeddingInfoService {
  constructor(
    private readonly repo: WeddingInfoRepository,
    private readonly invitationRepo: InvitationRepository,
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

  private async requireOne(id: string) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) {
      throw new NotFoundException('Không tìm thấy thông tin cặp đôi');
    }
    return entity;
  }

  /* ============================================================
   * BUILD WHERE
   * ============================================================ */
  private buildWhere(
    filter: FilterWeddingInfoDto,
  ): FindOptionsWhere<WeddingInfoEntity> {
    const where: FindOptionsWhere<WeddingInfoEntity> = { isDeleted: false };

    if (filter.invitationId) where.invitationId = filter.invitationId;
    if (filter.brideName) where.brideName = ILike(`%${filter.brideName}%`);
    if (filter.groomName) where.groomName = ILike(`%${filter.groomName}%`);
    if (filter.hashtag) where.hashtag = ILike(`%${filter.hashtag}%`);

    return where;
  }

  /* ============================================================
   * PAGINATION — Admin
   * ============================================================ */
  async pagination(data: PaginationDto<FilterWeddingInfoDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon = this.buildWhere(where);

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: { invitation: true },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  /* ============================================================
   * PAGINATION — User (chỉ wedding info của thiệp họ sở hữu)
   * ============================================================ */
  async paginationForUser(
    data: PaginationDto<FilterWeddingInfoDto>,
    user: UserDto,
  ) {
    const { skip = 0, take = 10, where = {} } = data;

    // Nếu filter theo 1 thiệp → check quyền
    if (where.invitationId) {
      await this.assertInvitationOwnership(
        where.invitationId,
        user,
        'xem thông tin cặp đôi của thiệp này',
      );

      const whereCon = this.buildWhere(where);
      const [list, total] = await this.repo.findAndCount({
        where: whereCon,
        relations: { invitation: true },
        skip,
        take,
        order: { createdAt: 'DESC' },
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
      relations: { invitation: true },
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
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
      relations: { invitation: true },
    });
    if (!entity) {
      throw new NotFoundException('Không tìm thấy thông tin cặp đôi');
    }

    if (user && !isAdminUser(user)) {
      await this.assertInvitationOwnership(
        entity.invitationId,
        user,
        'xem thông tin này',
      );
    }

    return { message: 'Thành công', data: entity };
  }

  /* ============================================================
   * FIND BY INVITATION ID
   * ============================================================ */
  async findByInvitationId(invitationId: string) {
    const entity = await this.repo.findOne({
      where: { invitationId, isDeleted: false },
    });
    if (!entity) {
      throw new NotFoundException('Thiệp này chưa có thông tin cặp đôi');
    }
    return { message: 'Thành công', data: entity };
  }

  /* ============================================================
   * CREATE
   * ============================================================ */
  async create(user: UserDto, dto: CreateWeddingInfoDto) {
    await this.assertInvitationOwnership(
      dto.invitationId,
      user,
      'tạo thông tin cặp đôi cho thiệp này',
    );

    // Mỗi thiệp chỉ có đúng 1 wedding info
    const existing = await this.repo.findOne({
      where: { invitationId: dto.invitationId, isDeleted: false },
    });
    if (existing) {
      throw new ConflictException(
        'Thiệp này đã có thông tin cặp đôi. Vui lòng cập nhật thay vì tạo mới.',
      );
    }

    const entity = this.repo.create({
      id: uuidv4(),
      invitationId: dto.invitationId,
      brideName: dto.brideName,
      brideShortName: dto.brideShortName,
      bridePhotoUrl: dto.bridePhotoUrl,
      brideFatherName: dto.brideFatherName,
      brideMotherName: dto.brideMotherName,
      brideBio: dto.brideBio,
      brideSocial: dto.brideSocial,
      groomName: dto.groomName,
      groomShortName: dto.groomShortName,
      groomPhotoUrl: dto.groomPhotoUrl,
      groomFatherName: dto.groomFatherName,
      groomMotherName: dto.groomMotherName,
      groomBio: dto.groomBio,
      groomSocial: dto.groomSocial,
      loveStartedAt: dto.loveStartedAt,
      loveStory: dto.loveStory,
      hashtag: dto.hashtag,
      createdBy: user.id,
    });

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thông tin cặp đôi thành công', data: saved };
  }

  /* ============================================================
   * UPDATE
   * ============================================================ */
  async update(dto: UpdateWeddingInfoDto, user: UserDto) {
    const entity = await this.requireOne(dto.id);

    await this.assertInvitationOwnership(
      entity.invitationId,
      user,
      'chỉnh sửa thông tin cặp đôi này',
    );

    this.assign(entity, dto);
    entity.updatedBy = user.id;

    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật thông tin cặp đôi thành công', data: saved };
  }

  /* ============================================================
   * UPSERT BY INVITATION
   * Dùng khi user cập nhật thiệp kèm thông tin cặp đôi
   * ============================================================ */
  async upsertByInvitation(
    user: UserDto,
    invitationId: string,
    dto: WeddingInfoDto,
  ) {
    await this.assertInvitationOwnership(
      invitationId,
      user,
      'cập nhật thông tin cặp đôi',
    );

    let entity = await this.repo.findOne({
      where: { invitationId, isDeleted: false },
    });

    if (!entity) {
      entity = this.repo.create({
        id: uuidv4(),
        invitationId,
        ...dto,
        createdBy: user.id,
      });
    } else {
      this.assign(entity, dto);
      entity.updatedBy = user.id;
    }

    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật thông tin cặp đôi thành công', data: saved };
  }

  /* ============================================================
   * DELETE (soft)
   * ============================================================ */
  async delete(data: IdDto, user: UserDto) {
    const entity = await this.requireOne(data.id);

    await this.assertInvitationOwnership(
      entity.invitationId,
      user,
      'xoá thông tin cặp đôi này',
    );

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xoá thông tin cặp đôi thành công' };
  }

  /* ============================================================
   * PUBLIC — Lấy thông tin cặp đôi của thiệp công khai
   * ============================================================ */
  async getPublicByInvitation(invitationId: string) {
    const invitation = await this.invitationRepo.findOne({
      where: { id: invitationId, isDeleted: false },
      select: { id: true, status: true, slug: true },
    });

    if (!invitation) {
      throw new NotFoundException('Không tìm thấy thiệp');
    }

    if (invitation.status !== enumData.INVITATION_STATUS.PUBLISHED.code) {
      throw new NotFoundException('Không tìm thấy thiệp');
    }

    const entity = await this.repo.findOne({
      where: { invitationId, isDeleted: false },
    });

    if (!entity) {
      return { message: 'Thiệp chưa có thông tin cặp đôi', data: null };
    }

    return { message: 'Thành công', data: entity };
  }

  /* ============================================================
   * PRIVATE — Assign field từ DTO vào entity
   * ============================================================ */
  private assign(entity: WeddingInfoEntity, dto: Partial<WeddingInfoDto>) {
    if (dto.brideName !== undefined) entity.brideName = dto.brideName;
    if (dto.brideShortName !== undefined) {
      entity.brideShortName = dto.brideShortName;
    }
    if (dto.bridePhotoUrl !== undefined) {
      entity.bridePhotoUrl = dto.bridePhotoUrl;
    }
    if (dto.brideFatherName !== undefined) {
      entity.brideFatherName = dto.brideFatherName;
    }
    if (dto.brideMotherName !== undefined) {
      entity.brideMotherName = dto.brideMotherName;
    }
    if (dto.brideBio !== undefined) entity.brideBio = dto.brideBio;
    if (dto.brideSocial !== undefined) entity.brideSocial = dto.brideSocial;

    if (dto.groomName !== undefined) entity.groomName = dto.groomName;
    if (dto.groomShortName !== undefined) {
      entity.groomShortName = dto.groomShortName;
    }
    if (dto.groomPhotoUrl !== undefined) {
      entity.groomPhotoUrl = dto.groomPhotoUrl;
    }
    if (dto.groomFatherName !== undefined) {
      entity.groomFatherName = dto.groomFatherName;
    }
    if (dto.groomMotherName !== undefined) {
      entity.groomMotherName = dto.groomMotherName;
    }
    if (dto.groomBio !== undefined) entity.groomBio = dto.groomBio;
    if (dto.groomSocial !== undefined) entity.groomSocial = dto.groomSocial;

    if (dto.loveStartedAt !== undefined) {
      entity.loveStartedAt = dto.loveStartedAt;
    }
    if (dto.loveStory !== undefined) entity.loveStory = dto.loveStory;
    if (dto.hashtag !== undefined) entity.hashtag = dto.hashtag;
  }
}
