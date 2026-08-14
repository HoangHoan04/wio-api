import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { PhotoWallEntity } from '@/entities';
import { InvitationRepository, PhotoWallRepository } from '@/repositories';
import {
  assertInvitationModule,
  assertPublishedInvitation,
} from '@/utils/invitation.utils';
import { assertOwner } from '@/utils/owner.utils';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { getActivePlanLimits } from '@/utils/quota.utils';
import {
  CreatePhotoWallDto,
  FilterPhotoWallDto,
  UpdatePhotoWallDto,
} from './dto';

@Injectable()
export class PhotoWallService {
  constructor(
    private readonly repo: PhotoWallRepository,
    private readonly invitationRepo: InvitationRepository,
  ) {}

  async pagination(data: PaginationDto<FilterPhotoWallDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<PhotoWallEntity> = { isDeleted: false };

    if (where.invitationId !== undefined) whereCon.invitationId = where.invitationId;
    if (where.guestId !== undefined) whereCon.guestId = where.guestId;
    if (where.uploaderName !== undefined)
      whereCon.uploaderName = where.uploaderName;
    if (where.url !== undefined) whereCon.url = where.url;
    if (where.storageKey !== undefined) whereCon.storageKey = where.storageKey;
    if (where.caption !== undefined) whereCon.caption = where.caption;
    if (where.isApproved !== undefined) whereCon.isApproved = where.isApproved;
    if (where.approvedAt !== undefined) whereCon.approvedAt = where.approvedAt;

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
    if (!item) throw new NotFoundException('Không tìm thấy bản ghi');
    return { message: 'Thành công', data: item };
  }

  async create(user: UserDto, dto: CreatePhotoWallDto) {
    const entity = new PhotoWallEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.invitationId !== undefined) entity.invitationId = dto.invitationId;
    if (dto.guestId !== undefined) entity.guestId = dto.guestId;
    if (dto.uploaderName !== undefined) entity.uploaderName = dto.uploaderName;
    if (dto.url !== undefined) entity.url = dto.url;
    if (dto.storageKey !== undefined) entity.storageKey = dto.storageKey;
    if (dto.caption !== undefined) entity.caption = dto.caption;
    if (dto.isApproved !== undefined) entity.isApproved = dto.isApproved;
    if (dto.approvedAt !== undefined) entity.approvedAt = dto.approvedAt;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async createPublic(dto: CreatePhotoWallDto) {
    const invitation = await this.invitationRepo.findOne({
      where: { id: dto.invitationId, isDeleted: false },
    });
    assertPublishedInvitation(invitation);
    assertInvitationModule(
      invitation!,
      enumData.INVITATION_MODULE.PHOTO_WALL.code,
      'Thiệp này không bật tường ảnh',
    );

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

    const entity = new PhotoWallEntity();
    entity.id = uuidv4();
    entity.invitationId = dto.invitationId;
    entity.guestId = dto.guestId;
    entity.uploaderName = dto.uploaderName;
    entity.url = dto.url;
    entity.storageKey = dto.storageKey;
    entity.caption = dto.caption;
    entity.isApproved = dto.isApproved ?? false;
    const saved = await this.repo.save(entity);
    return { message: 'Tải ảnh thành công, chờ duyệt', data: saved };
  }

  async update(dto: UpdatePhotoWallDto, user: UserDto) {
    const entity = await this.requireOwnedPhoto(dto.id, user);
    entity.updatedBy = user.id;

    if (dto.invitationId !== undefined) entity.invitationId = dto.invitationId;
    if (dto.guestId !== undefined) entity.guestId = dto.guestId;
    if (dto.uploaderName !== undefined) entity.uploaderName = dto.uploaderName;
    if (dto.url !== undefined) entity.url = dto.url;
    if (dto.storageKey !== undefined) entity.storageKey = dto.storageKey;
    if (dto.caption !== undefined) entity.caption = dto.caption;
    if (dto.isApproved !== undefined) entity.isApproved = dto.isApproved;
    if (dto.approvedAt !== undefined) entity.approvedAt = dto.approvedAt;

    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật thành công', data: saved };
  }

  async delete(data: IdDto, user: UserDto) {
    const entity = await this.requireOwnedPhoto(data.id, user);
    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xóa thành công' };
  }

  async approve(data: IdDto, user: UserDto) {
    const entity = await this.requireOwnedPhoto(data.id, user);
    entity.isApproved = true;
    entity.approvedAt = new Date();
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Duyệt ảnh thành công', data: saved };
  }

  async reject(data: IdDto, user: UserDto) {
    const entity = await this.requireOwnedPhoto(data.id, user);
    entity.isApproved = false;
    entity.approvedAt = null as any;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Từ chối duyệt ảnh thành công', data: saved };
  }

  private async requireOwnedPhoto(id: string, user: UserDto) {
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
