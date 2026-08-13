import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import {
  GuestGroupEntity,
  InvitationEntity,
  InvitationEventEntity,
  InvitationGiftEntity,
  InvitationHostEntity,
  InvitationPhotoEntity,
  InvitationTimelineEntity,
  SlugHistoryEntity,
  SubscriptionEntity,
  TemplateEntity,
} from '@/entities';
import {
  GuestRepository,
  InvitationRepository,
  SlugHistoryRepository,
  TableRepository,
  WishRepository,
} from '@/repositories';
import {
  defaultEnabledModules,
  defaultGuestGroups,
  defaultMusicConfig,
  defaultSectionConfig,
  pickPrimaryEventAt,
  toCardViewModel,
} from '@/utils/invitation.utils';
import { assertOwner } from '@/utils/owner.utils';
import { getActivePlanLimits } from '@/utils/quota.utils';
import {
  buildShareUrl,
  ensureSlug,
  invitationStatusesBlockingSlug,
  isReservedSlug,
  isValidSlugFormat,
} from '@/utils/slug.utils';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as QRCode from 'qrcode';
import { Brackets, FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  AdminForceResetSlugDto,
  CheckSlugDto,
  CreateInvitationDto,
  FilterInvitationDto,
  UpdateInvitationDto,
} from './dto';
import { sanitizeExtraContent } from './invitation.schema';

const NESTED_RELATIONS = {
  hosts: true,
  events: true,
  timelines: true,
  photos: true,
  gifts: true,
  guestGroups: true,
  template: true,
};

@Injectable()
export class InvitationService {
  constructor(
    private readonly repo: InvitationRepository,
    private readonly slugHistoryRepo: SlugHistoryRepository,
    private readonly guestRepo: GuestRepository,
    private readonly tableRepo: TableRepository,
    private readonly wishRepo: WishRepository,
  ) {}

  async pagination(data: PaginationDto<FilterInvitationDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<InvitationEntity> = { isDeleted: false };

    if (where.userId !== undefined) whereCon.userId = where.userId;
    if (where.templateId !== undefined) whereCon.templateId = where.templateId;
    if (where.cardType !== undefined) whereCon.cardType = where.cardType;
    if (where.slug !== undefined) whereCon.slug = where.slug;
    if (where.title !== undefined) whereCon.title = ILike(`%${where.title}%`);
    if (where.status !== undefined) whereCon.status = where.status;

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: ['user'],
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    const mapped = list.map((item) => ({
      ...item,
      user: item.user
        ? {
            id: item.user.id,
            email: item.user.email,
            phone: item.user.phone,
          }
        : null,
    }));

    return { data: mapped, total };
  }

  async findById(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
      relations: NESTED_RELATIONS,
    });
    if (!item) throw new NotFoundException('Không tìm thấy thiệp');
    return { message: 'Thành công', data: item };
  }

  async create(user: UserDto, dto: CreateInvitationDto) {
    const entity = new InvitationEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;
    entity.userId = dto.userId || user.id;
    entity.cardType = dto.cardType;
    entity.title = dto.title;
    entity.status = enumData.INVITATION_STATUS.DRAFT.code;
    entity.viewCount = 0;
    entity.sectionConfig = dto.sectionConfig || defaultSectionConfig();
    entity.enabledModules =
      dto.enabledModules || defaultEnabledModules(dto.cardType);
    entity.music = dto.music || defaultMusicConfig();
    entity.extraContent = sanitizeExtraContent(dto.cardType, dto.extraContent);

    await this.assertInvitationQuota(user.id);
    await this.assignTemplate(entity, dto.templateId, user.id);
    await this.assignSlug(entity, dto.slug, dto.title);

    this.assignScalar(entity, dto);
    if (dto.photos !== undefined) {
      await this.assertPhotoQuota(entity.userId, dto.photos.length);
    }
    this.assignNested(entity, dto);
    this.ensureGuestGroups(entity, dto);

    entity.primaryEventAt = pickPrimaryEventAt(entity.events) || undefined;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateInvitationDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
      relations: NESTED_RELATIONS,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thiệp');
    assertOwner(user, entity.userId, 'Bạn không có quyền chỉnh sửa thiệp này');

    if (entity.status === enumData.INVITATION_STATUS.PUBLISHED.code) {
      throw new ForbiddenException('Thiệp đã xuất bản không thể chỉnh sửa');
    }

    entity.updatedBy = user.id;
    if (dto.title !== undefined) entity.title = dto.title;
    if (dto.cardType !== undefined) entity.cardType = dto.cardType;

    await this.assignTemplate(entity, dto.templateId, user.id);
    if (dto.slug !== undefined && dto.slug !== entity.slug) {
      await this.changeSlug(entity, dto.slug, user.id, dto.slugReason);
    }

    this.assignScalar(entity, dto);
    if (dto.photos !== undefined) {
      await this.assertPhotoQuota(entity.userId, dto.photos.length);
    }
    await this.replaceNested(entity, dto);
    entity.primaryEventAt = pickPrimaryEventAt(entity.events) || undefined;

    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật thành công', data: saved };
  }

  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thiệp');
    assertOwner(user, entity.userId, 'Bạn không có quyền xóa thiệp này');

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xóa thành công' };
  }

  async findBySlug(slug: string) {
    const item = await this.repo.findOne({
      where: { slug, isDeleted: false },
      relations: NESTED_RELATIONS,
    });
    if (!item) throw new NotFoundException('Không tìm thấy thiệp');
    if (item.status !== enumData.INVITATION_STATUS.PUBLISHED.code) {
      throw new NotFoundException('Không tìm thấy thiệp');
    }
    item.viewCount = (item.viewCount || 0) + 1;
    await this.repo.save(item);
    return { message: 'Thành công', data: toCardViewModel(item) };
  }

  async publish(id: string, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thiệp');
    assertOwner(user, entity.userId, 'Bạn không có quyền xuất bản thiệp này');

    entity.status = enumData.INVITATION_STATUS.PUBLISHED.code;
    entity.publishedAt = new Date();
    entity.shareUrl = buildShareUrl(entity.slug);
    try {
      entity.shareQrUrl = await QRCode.toDataURL(entity.shareUrl);
    } catch {
      entity.shareQrUrl = '';
    }

    const saved = await this.repo.save(entity);
    return { message: 'Xuất bản thành công', data: saved };
  }

  async unpublish(id: string, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thiệp');
    assertOwner(
      user,
      entity.userId,
      'Bạn không có quyền thực hiện thao tác này',
    );

    entity.status = enumData.INVITATION_STATUS.DRAFT.code;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Đã chuyển về nháp', data: saved };
  }

  async archive(id: string, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thiệp');
    assertOwner(
      user,
      entity.userId,
      'Bạn không có quyền thực hiện thao tác này',
    );

    entity.status = enumData.INVITATION_STATUS.ARCHIVED.code;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Đã lưu trữ thiệp', data: saved };
  }

  async getShareUrl(id: string, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thiệp');
    assertOwner(
      user,
      entity.userId,
      'Bạn không có quyền xem thông tin chia sẻ',
    );

    const shareUrl = entity.shareUrl || buildShareUrl(entity.slug);
    let qrCodeBase64 = entity.shareQrUrl;
    if (!qrCodeBase64) {
      try {
        qrCodeBase64 = await QRCode.toDataURL(shareUrl);
      } catch {
        qrCodeBase64 = '';
      }
    }
    return { shareUrl, qrCodeBase64 };
  }

  async getStats(id: string, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thiệp');
    assertOwner(user, entity.userId, 'Bạn không có quyền xem thống kê');

    const pending = enumData.RSVP_STATUS.PENDING.code;
    const attending = enumData.RSVP_STATUS.ATTENDING.code;
    const declined = enumData.RSVP_STATUS.DECLINED.code;

    const [totalGuests, pendingCount, attendingCount, declinedCount] =
      await Promise.all([
        this.guestRepo.count({ where: { invitationId: id, isDeleted: false } }),
        this.guestRepo.count({
          where: { invitationId: id, rsvpStatus: pending, isDeleted: false },
        }),
        this.guestRepo.count({
          where: { invitationId: id, rsvpStatus: attending, isDeleted: false },
        }),
        this.guestRepo.count({
          where: { invitationId: id, rsvpStatus: declined, isDeleted: false },
        }),
      ]);

    const attendingGuests = await this.guestRepo.find({
      where: { invitationId: id, rsvpStatus: attending, isDeleted: false },
    });
    const totalAttendingSeats = attendingGuests.reduce(
      (sum, g) => sum + (g.attendingCount || 1),
      0,
    );

    const recentGuests = await this.guestRepo.find({
      where: { invitationId: id, isDeleted: false },
      order: { rsvpAt: 'DESC' },
      take: 5,
    });

    return {
      message: 'Thành công',
      data: {
        totalGuests,
        rsvp: {
          pending: pendingCount,
          attending: attendingCount,
          declined: declinedCount,
          totalSeats: totalAttendingSeats,
        },
        recentGuests,
      },
    };
  }

  async adminForceResetSlug(dto: AdminForceResetSlugDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.invitationId, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thiệp');
    await this.changeSlug(entity, dto.newSlug, user.id, dto.reason);
    if (entity.shareUrl) {
      entity.shareUrl = buildShareUrl(dto.newSlug);
      try {
        entity.shareQrUrl = await QRCode.toDataURL(entity.shareUrl);
      } catch {
        entity.shareQrUrl = '';
      }
    }
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return {
      message: 'Force-reset slug thành công',
      data: { oldSlug: dto.newSlug, newSlug: dto.newSlug, invitation: saved },
    };
  }

  async getSlugHistory(invitationId: string) {
    const history = await this.slugHistoryRepo.find({
      where: { invitationId },
      order: { createdAt: 'DESC' },
    });
    return { message: 'Thành công', data: history };
  }

  async checkSlug(dto: CheckSlugDto) {
    const available = await this.checkSlugAvailable(dto.slug);
    return { message: 'Thành công', data: { available } };
  }

  async checkSlugAvailable(slug: string): Promise<boolean> {
    if (!isValidSlugFormat(slug) || isReservedSlug(slug)) return false;
    const graceDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const existing = await this.repo
      .createQueryBuilder('inv')
      .where('inv.slug = :slug', { slug })
      .andWhere('inv.isDeleted = false')
      .andWhere(
        new Brackets((qb) => {
          qb.where('inv.status IN (:...statuses)', {
            statuses: invitationStatusesBlockingSlug(),
          }).orWhere('inv.status = :archived AND inv.updatedAt > :graceDate', {
            archived: enumData.INVITATION_STATUS.ARCHIVED.code,
            graceDate,
          });
        }),
      )
      .getOne();
    return !existing;
  }

  private async assignTemplate(
    entity: InvitationEntity,
    templateId: string | undefined,
    userId: string,
  ) {
    if (templateId === undefined) return;
    if (!templateId) {
      entity.templateId = undefined;
      return;
    }
    const template = await this.repo.manager.findOne(TemplateEntity, {
      where: { id: templateId, isDeleted: false },
    });
    if (template?.isPremium) {
      const sub = await this.repo.manager
        .createQueryBuilder(SubscriptionEntity, 'sub')
        .where('sub.userId = :userId', { userId })
        .andWhere('sub.status = :status', {
          status: enumData.SUB_STATUS.ACTIVE.code,
        })
        .andWhere('sub.expiresAt > :now', { now: new Date() })
        .getOne();
      if (!sub) {
        throw new ForbiddenException(
          'Giao diện này thuộc gói Premium. Vui lòng đăng ký gói dịch vụ để sử dụng.',
        );
      }
    }
    entity.templateId = templateId;
  }

  private async assignSlug(
    entity: InvitationEntity,
    slug?: string,
    title?: string,
  ) {
    const candidate = ensureSlug(slug, title);
    const available = await this.checkSlugAvailable(candidate);
    if (!available) {
      throw new ConflictException('Slug đã tồn tại hoặc không hợp lệ');
    }
    entity.slug = candidate;
  }

  private async assertInvitationQuota(userId: string) {
    const count = await this.repo.count({
      where: { userId, isDeleted: false },
    });
    const { maxInvitations } = await getActivePlanLimits(
      this.repo.manager,
      userId,
    );
    if (count >= maxInvitations) {
      throw new ForbiddenException(
        `Gói hiện tại cho phép tối đa ${maxInvitations} thiệp`,
      );
    }
  }

  private async assertPhotoQuota(userId: string, photoCount: number) {
    const { maxPhotos } = await getActivePlanLimits(this.repo.manager, userId);
    if (photoCount > maxPhotos) {
      throw new ForbiddenException(
        `Gói hiện tại cho phép tối đa ${maxPhotos} ảnh`,
      );
    }
  }

  private async changeSlug(
    entity: InvitationEntity,
    newSlug: string,
    userId: string,
    reason?: string,
  ) {
    const available = await this.checkSlugAvailable(newSlug);
    if (!available) {
      throw new ConflictException('Slug đã tồn tại hoặc không hợp lệ');
    }
    const history = new SlugHistoryEntity();
    history.id = uuidv4();
    history.invitationId = entity.id;
    history.oldSlug = entity.slug;
    history.newSlug = newSlug;
    history.changedBy = userId;
    history.reason = reason || 'User updated slug';
    await this.slugHistoryRepo.save(history);
    entity.slug = newSlug;
  }

  private assignScalar(
    entity: InvitationEntity,
    dto: Partial<CreateInvitationDto>,
  ) {
    if (dto.invitationText !== undefined)
      entity.invitationText = dto.invitationText;
    if (dto.thankYouText !== undefined) entity.thankYouText = dto.thankYouText;
    if (dto.hashtag !== undefined) entity.hashtag = dto.hashtag;
    if (dto.heroImageUrl !== undefined) entity.heroImageUrl = dto.heroImageUrl;
    if (dto.sectionConfig !== undefined)
      entity.sectionConfig = dto.sectionConfig;
    if (dto.enabledModules !== undefined)
      entity.enabledModules = dto.enabledModules;
    if (dto.music !== undefined) entity.music = dto.music;
    if (dto.extraContent !== undefined) {
      entity.extraContent = sanitizeExtraContent(
        dto.cardType || entity.cardType,
        dto.extraContent,
      );
    }
    if (dto.customDesign !== undefined) entity.customDesign = dto.customDesign;
    if (dto.coverConfig !== undefined) entity.coverConfig = dto.coverConfig;
  }

  private assignNested(
    entity: InvitationEntity,
    dto: Partial<CreateInvitationDto>,
  ) {
    if (dto.hosts) {
      entity.hosts = dto.hosts.map((item, idx) => {
        const host = new InvitationHostEntity();
        Object.assign(host, item);
        host.sortOrder = item.sortOrder ?? idx;
        return host;
      });
    }
    if (dto.events) {
      entity.events = dto.events.map((item, idx) => {
        const event = new InvitationEventEntity();
        Object.assign(event, item);
        event.sortOrder = item.sortOrder ?? idx;
        event.isPrimary = item.isPrimary ?? idx === 0;
        return event;
      });
    }
    if (dto.gifts) {
      entity.gifts = dto.gifts.map((item, idx) => {
        const gift = new InvitationGiftEntity();
        Object.assign(gift, item);
        gift.sortOrder = item.sortOrder ?? idx;
        return gift;
      });
    }
    if (dto.timelines) {
      entity.timelines = dto.timelines.map((item, idx) => {
        const row = new InvitationTimelineEntity();
        Object.assign(row, item);
        row.sortOrder = item.sortOrder ?? idx;
        return row;
      });
    }
    if (dto.photos) {
      entity.photos = dto.photos.map((item, idx) => {
        const photo = new InvitationPhotoEntity();
        Object.assign(photo, item);
        photo.kind = item.kind || enumData.PHOTO_KIND.GALLERY.code;
        photo.sortOrder = item.sortOrder ?? idx;
        return photo;
      });
    }
    if (dto.guestGroups) {
      entity.guestGroups = dto.guestGroups.map((item, idx) => {
        const group = new GuestGroupEntity();
        Object.assign(group, item);
        group.sortOrder = item.sortOrder ?? idx;
        return group;
      });
    }
  }

  private ensureGuestGroups(
    entity: InvitationEntity,
    dto: Partial<CreateInvitationDto>,
  ) {
    if (entity.guestGroups?.length) return;
    entity.guestGroups = defaultGuestGroups(
      dto.cardType || entity.cardType,
    ).map((item, idx) => {
      const group = new GuestGroupEntity();
      group.code = item.code;
      group.name = item.name;
      group.sortOrder = idx;
      return group;
    });
  }

  private async replaceNested(
    entity: InvitationEntity,
    dto: Partial<CreateInvitationDto>,
  ) {
    const manager = this.repo.manager;
    if (dto.hosts !== undefined) {
      await manager.delete(InvitationHostEntity, { invitationId: entity.id });
    }
    if (dto.events !== undefined) {
      await manager.delete(InvitationEventEntity, { invitationId: entity.id });
    }
    if (dto.gifts !== undefined) {
      await manager.delete(InvitationGiftEntity, { invitationId: entity.id });
    }
    if (dto.timelines !== undefined) {
      await manager.delete(InvitationTimelineEntity, {
        invitationId: entity.id,
      });
    }
    if (dto.photos !== undefined) {
      await manager.delete(InvitationPhotoEntity, { invitationId: entity.id });
    }
    if (dto.guestGroups !== undefined) {
      await manager.delete(GuestGroupEntity, { invitationId: entity.id });
    }
    this.assignNested(entity, dto);
  }
}
