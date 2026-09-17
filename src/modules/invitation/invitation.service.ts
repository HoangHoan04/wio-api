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
  TemplateEntity,
  WeddingInfoEntity,
} from '@/entities';
import {
  GuestRepository,
  InvitationRepository,
  SlugHistoryRepository,
  SubscriptionRepository,
  TableRepository,
  WishRepository,
} from '@/repositories';
import {
  defaultSectionConfig,
  pickPrimaryEventAt,
  toCardViewModel,
} from '@/utils/invitation.utils';
import { assertOwner } from '@/utils/owner.utils';
import { getActivePlanLimits } from '@/utils/quota.utils';
import {
  buildShareUrl,
  ensureSlug,
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
import { FindOptionsWhere, ILike, In, LessThan } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  AdminForceResetSlugDto,
  CheckSlugDto,
  CreateInvitationDto,
  FilterInvitationDto,
  UpdateInvitationDto,
} from './dto';

/* ============================================================
 * RELATIONS — cấu hình load đầy đủ nested
 * ============================================================ */
const NESTED_RELATIONS = {
  weddingInfo: true,
  hosts: true,
  events: true,
  timelines: true,
  photos: true,
  gifts: true,
  guestGroups: true,
  template: true,
} as const;

@Injectable()
export class InvitationService {
  constructor(
    private readonly repo: InvitationRepository,
    private readonly slugHistoryRepo: SlugHistoryRepository,
    private readonly subscriptionRepo: SubscriptionRepository,
    private readonly guestRepo: GuestRepository,
    private readonly tableRepo: TableRepository,
    private readonly wishRepo: WishRepository,
  ) {}

  /* ============================================================
   * PAGINATION
   * ============================================================ */
  async pagination(data: PaginationDto<FilterInvitationDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<InvitationEntity> = { isDeleted: false };

    if (where.userId) whereCon.userId = where.userId;
    if (where.templateId) whereCon.templateId = where.templateId;
    if (where.designMode) whereCon.designMode = where.designMode;
    if (where.weddingTheme) whereCon.weddingTheme = where.weddingTheme;
    if (where.slug) whereCon.slug = where.slug;
    if (where.title) whereCon.title = ILike(`%${where.title}%`);
    if (where.status) whereCon.status = where.status;

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: { user: true },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    const mapped = list.map((item) => ({
      ...item,
      user: item.user
        ? { id: item.user.id, email: item.user.email, phone: item.user.phone }
        : null,
    }));

    return { data: mapped, total };
  }

  /* ============================================================
   * FIND BY ID
   * ============================================================ */
  async findById(data: IdDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
      relations: NESTED_RELATIONS,
    });
    if (!item) throw new NotFoundException('Không tìm thấy thiệp');
    return { message: 'Thành công', data: item };
  }

  /* ============================================================
   * CREATE
   * ============================================================ */
  async create(user: UserDto, dto: CreateInvitationDto) {
    const ownerId = dto.userId || user.id;

    await this.assertInvitationQuota(ownerId);
    await this.assertTemplateAccess(dto.templateId, ownerId);

    const slug = await this.assignSlug(dto.slug, dto.title);

    const entity = this.repo.create({
      id: uuidv4(),
      userId: ownerId,
      templateId: dto.templateId,
      designMode: dto.designMode,
      weddingTheme: dto.weddingTheme,
      title: dto.title,
      slug,
      status: enumData.INVITATION_STATUS.DRAFT.code,
      invitationText: dto.invitationText,
      thankYouText: dto.thankYouText,
      heroImageUrl: dto.heroImageUrl,
      sectionConfig: dto.sectionConfig || defaultSectionConfig(),
      musicId: dto.musicId,
      musicConfig: dto.musicConfig,
      customDesign: dto.customDesign,
      aiGeneratedMeta: dto.aiGeneratedMeta,
      seoTitle: dto.seoTitle,
      seoDescription: dto.seoDescription,
      viewCount: 0,
      uniqueViewCount: 0,
      createdBy: user.id,
    });

    // Nested
    if (dto.weddingInfo) {
      entity.weddingInfo = this.repo.manager.create(WeddingInfoEntity, {
        ...dto.weddingInfo,
        id: uuidv4(),
      });
    }
    entity.hosts = this.mapHosts(dto.hosts);
    entity.events = this.mapEvents(dto.events);
    entity.gifts = this.mapGifts(dto.gifts);
    entity.timelines = this.mapTimelines(dto.timelines);
    entity.photos = this.mapPhotos(dto.photos);

    if (dto.guestGroups?.length) {
      entity.guestGroups = this.mapGuestGroups(dto.guestGroups);
    }

    entity.primaryEventAt = pickPrimaryEventAt(entity.events) ?? undefined;

    if (entity.photos?.length) {
      await this.assertPhotoQuota(ownerId, entity.photos.length);
    }

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thiệp thành công', data: saved };
  }

  /* ============================================================
   * UPDATE
   * ============================================================ */
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

    if (dto.templateId !== undefined) {
      await this.assertTemplateAccess(dto.templateId, entity.userId);
      entity.templateId = dto.templateId ?? undefined;
    }

    if (dto.slug && dto.slug !== entity.slug) {
      await this.changeSlug(entity, dto.slug, user.id, dto.slugReason);
    }

    if (dto.title !== undefined) entity.title = dto.title;
    if (dto.designMode !== undefined) entity.designMode = dto.designMode;
    if (dto.weddingTheme !== undefined) entity.weddingTheme = dto.weddingTheme;
    if (dto.invitationText !== undefined) {
      entity.invitationText = dto.invitationText;
    }
    if (dto.thankYouText !== undefined) entity.thankYouText = dto.thankYouText;
    if (dto.heroImageUrl !== undefined) entity.heroImageUrl = dto.heroImageUrl;
    if (dto.sectionConfig !== undefined) {
      entity.sectionConfig = dto.sectionConfig;
    }
    if (dto.musicId !== undefined) entity.musicId = dto.musicId;
    if (dto.musicConfig !== undefined) entity.musicConfig = dto.musicConfig;
    if (dto.customDesign !== undefined) {
      entity.customDesign = dto.customDesign;
    }
    if (dto.aiGeneratedMeta !== undefined) {
      entity.aiGeneratedMeta = dto.aiGeneratedMeta;
    }
    if (dto.seoTitle !== undefined) entity.seoTitle = dto.seoTitle;
    if (dto.seoDescription !== undefined) {
      entity.seoDescription = dto.seoDescription;
    }

    // WeddingInfo
    if (dto.weddingInfo !== undefined) {
      if (entity.weddingInfo) {
        Object.assign(entity.weddingInfo, dto.weddingInfo);
      } else {
        entity.weddingInfo = this.repo.manager.create(WeddingInfoEntity, {
          ...dto.weddingInfo,
          id: uuidv4(),
        });
      }
    }

    // Nested — replace nếu có
    if (dto.hosts !== undefined) {
      await this.repo.manager.delete(InvitationHostEntity, {
        invitationId: entity.id,
      });
      entity.hosts = this.mapHosts(dto.hosts);
    }
    if (dto.events !== undefined) {
      await this.repo.manager.delete(InvitationEventEntity, {
        invitationId: entity.id,
      });
      entity.events = this.mapEvents(dto.events);
    }
    if (dto.gifts !== undefined) {
      await this.repo.manager.delete(InvitationGiftEntity, {
        invitationId: entity.id,
      });
      entity.gifts = this.mapGifts(dto.gifts);
    }
    if (dto.timelines !== undefined) {
      await this.repo.manager.delete(InvitationTimelineEntity, {
        invitationId: entity.id,
      });
      entity.timelines = this.mapTimelines(dto.timelines);
    }
    if (dto.photos !== undefined) {
      await this.assertPhotoQuota(entity.userId, dto.photos.length);
      await this.repo.manager.delete(InvitationPhotoEntity, {
        invitationId: entity.id,
      });
      entity.photos = this.mapPhotos(dto.photos);
    }
    if (dto.guestGroups !== undefined) {
      await this.repo.manager.delete(GuestGroupEntity, {
        invitationId: entity.id,
      });
      entity.guestGroups = this.mapGuestGroups(dto.guestGroups);
    }

    entity.primaryEventAt = pickPrimaryEventAt(entity.events) ?? undefined;
    entity.updatedBy = user.id;

    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật thiệp thành công', data: saved };
  }

  /* ============================================================
   * DELETE
   * ============================================================ */
  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thiệp');
    assertOwner(user, entity.userId, 'Bạn không có quyền xóa thiệp này');

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xóa thiệp thành công' };
  }

  /* ============================================================
   * PUBLIC — Find by slug
   * ============================================================ */
  async findBySlug(slug: string) {
    const item = await this.repo.findOne({
      where: { slug, isDeleted: false },
      relations: NESTED_RELATIONS,
    });
    if (!item || item.status !== enumData.INVITATION_STATUS.PUBLISHED.code) {
      throw new NotFoundException('Không tìm thấy thiệp');
    }
    item.viewCount = (item.viewCount || 0) + 1;
    await this.repo.save(item);

    return { message: 'Thành công', data: toCardViewModel(item) };
  }

  /* ============================================================
   * PUBLISH / UNPUBLISH / ARCHIVE
   * ============================================================ */
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

    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Xuất bản thành công', data: saved };
  }

  async unpublish(id: string, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thiệp');
    assertOwner(user, entity.userId, 'Bạn không có quyền thực hiện');

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
    assertOwner(user, entity.userId, 'Bạn không có quyền thực hiện');

    entity.status = enumData.INVITATION_STATUS.ARCHIVED.code;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Đã lưu trữ thiệp', data: saved };
  }

  /* ============================================================
   * SHARE URL
   * ============================================================ */
  async getShareUrl(id: string, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thiệp');
    assertOwner(user, entity.userId, 'Bạn không có quyền xem');

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

  /* ============================================================
   * STATS — RSVP
   * ============================================================ */
  async getStats(id: string, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thiệp');
    assertOwner(user, entity.userId, 'Bạn không có quyền xem thống kê');

    const baseWhere = { invitationId: id, isDeleted: false };

    const [totalGuests, pendingCount, attendingCount, declinedCount] =
      await Promise.all([
        this.guestRepo.count({ where: baseWhere }),
        this.guestRepo.count({
          where: {
            ...baseWhere,
            rsvpStatus: enumData.RSVP_STATUS.PENDING.code,
          },
        }),
        this.guestRepo.count({
          where: {
            ...baseWhere,
            rsvpStatus: enumData.RSVP_STATUS.ATTENDING.code,
          },
        }),
        this.guestRepo.count({
          where: {
            ...baseWhere,
            rsvpStatus: enumData.RSVP_STATUS.DECLINED.code,
          },
        }),
      ]);

    const attendingGuests = await this.guestRepo.find({
      where: {
        ...baseWhere,
        rsvpStatus: enumData.RSVP_STATUS.ATTENDING.code,
      },
    });
    const totalAttendingSeats = attendingGuests.reduce(
      (sum, g) => sum + (g.attendingCount || 1),
      0,
    );

    const recentGuests = await this.guestRepo.find({
      where: baseWhere,
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

  /* ============================================================
   * ADMIN — Force reset slug
   * ============================================================ */
  async adminForceResetSlug(dto: AdminForceResetSlugDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.invitationId, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thiệp');

    const oldSlug = entity.slug;
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
      data: { oldSlug, newSlug: dto.newSlug, invitation: saved },
    };
  }

  /* ============================================================
   * SLUG HISTORY
   * ============================================================ */
  async getSlugHistory(invitationId: string) {
    const history = await this.slugHistoryRepo.find({
      where: { invitationId },
      order: { createdAt: 'DESC' },
    });
    return { message: 'Thành công', data: history };
  }

  /* ============================================================
   * CHECK SLUG
   * ============================================================ */
  async checkSlug(dto: CheckSlugDto) {
    const available = await this.checkSlugAvailable(dto.slug);
    return { message: 'Thành công', data: { available } };
  }

  private async checkSlugAvailable(slug: string): Promise<boolean> {
    if (!isValidSlugFormat(slug) || isReservedSlug(slug)) return false;

    const graceDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    // Bước 1: tìm slug đang bị chiếm bởi thiệp active (chưa xoá mềm)
    const blockingStatuses = [
      enumData.INVITATION_STATUS.DRAFT.code,
      enumData.INVITATION_STATUS.PUBLISHED.code,
    ];

    const activeBlocking = await this.repo.count({
      where: {
        slug,
        isDeleted: false,
        status: In(blockingStatuses),
      },
    });
    if (activeBlocking > 0) return false;

    // Bước 2: slug bị chiếm bởi thiệp ARCHIVED trong vòng 90 ngày
    const archivedBlocking = await this.repo.count({
      where: {
        slug,
        isDeleted: false,
        status: enumData.INVITATION_STATUS.ARCHIVED.code,
        updatedAt: LessThan(new Date()) as any, // luôn true
        // TypeORM không hỗ trợ "greaterThan" trực tiếp trong object — dùng MoreThan
      },
    });
    // Cách viết rõ hơn: dùng MoreThan
    const { MoreThan } = await import('typeorm');
    const archived = await this.repo.count({
      where: {
        slug,
        isDeleted: false,
        status: enumData.INVITATION_STATUS.ARCHIVED.code,
        updatedAt: MoreThan(graceDate),
      },
    });
    if (archived > 0) return false;

    return true;
  }

  /* ============================================================
   * PRIVATE HELPERS — MAPPING NESTED
   * ============================================================ */
  private mapHosts(items?: any[]): InvitationHostEntity[] {
    if (!items) return [];
    return items.map((item, idx) =>
      this.repo.manager.create(InvitationHostEntity, {
        ...item,
        id: item.id || uuidv4(),
        sortOrder: item.sortOrder ?? idx,
      }),
    );
  }

  private mapEvents(items?: any[]): InvitationEventEntity[] {
    if (!items) return [];
    return items.map((item, idx) =>
      this.repo.manager.create(InvitationEventEntity, {
        ...item,
        id: item.id || uuidv4(),
        sortOrder: item.sortOrder ?? idx,
        isPrimary: item.isPrimary ?? idx === 0,
      }),
    );
  }

  private mapGifts(items?: any[]): InvitationGiftEntity[] {
    if (!items) return [];
    return items.map((item, idx) =>
      this.repo.manager.create(InvitationGiftEntity, {
        ...item,
        id: item.id || uuidv4(),
        sortOrder: item.sortOrder ?? idx,
      }),
    );
  }

  private mapTimelines(items?: any[]): InvitationTimelineEntity[] {
    if (!items) return [];
    return items.map((item, idx) =>
      this.repo.manager.create(InvitationTimelineEntity, {
        ...item,
        id: item.id || uuidv4(),
        sortOrder: item.sortOrder ?? idx,
      }),
    );
  }

  private mapPhotos(items?: any[]): InvitationPhotoEntity[] {
    if (!items) return [];
    return items.map((item, idx) =>
      this.repo.manager.create(InvitationPhotoEntity, {
        ...item,
        id: item.id || uuidv4(),
        kind: item.kind || enumData.PHOTO_KIND.GALLERY.code,
        sortOrder: item.sortOrder ?? idx,
      }),
    );
  }

  private mapGuestGroups(items?: any[]): GuestGroupEntity[] {
    if (!items) return [];
    return items.map((item, idx) =>
      this.repo.manager.create(GuestGroupEntity, {
        ...item,
        id: item.id || uuidv4(),
        sortOrder: item.sortOrder ?? idx,
      }),
    );
  }

  /* ============================================================
   * PRIVATE HELPERS — QUOTA
   * ============================================================ */
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

  /* ============================================================
   * PRIVATE HELPERS — TEMPLATE ACCESS
   * ============================================================ */
  private async assertTemplateAccess(
    templateId: string | undefined,
    userId: string,
  ) {
    if (!templateId) return;

    const template = await this.repo.manager.findOne(TemplateEntity, {
      where: { id: templateId, isDeleted: false },
    });
    if (!template) throw new NotFoundException('Không tìm thấy template');

    if (template.isPremium) {
      const sub = await this.subscriptionRepo.findOne({
        where: {
          userId,
          status: enumData.SUB_STATUS.ACTIVE.code,
        },
        relations: { plan: true },
      });

      const validSub = sub && sub.expiresAt > new Date();
      if (!validSub) {
        throw new ForbiddenException(
          'Giao diện này thuộc gói Premium. Vui lòng đăng ký gói dịch vụ để sử dụng.',
        );
      }
    }
  }

  /* ============================================================
   * PRIVATE HELPERS — SLUG
   * ============================================================ */
  private async assignSlug(
    slug: string | undefined,
    title: string | undefined,
  ): Promise<string> {
    const candidate = ensureSlug(slug, title);
    const available = await this.checkSlugAvailable(candidate);
    if (!available) {
      throw new ConflictException('Slug đã tồn tại hoặc không hợp lệ');
    }
    return candidate;
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

    const history = this.slugHistoryRepo.create({
      id: uuidv4(),
      invitationId: entity.id,
      oldSlug: entity.slug,
      newSlug,
      changedBy: userId,
      reason: reason || 'User updated slug',
    });
    await this.slugHistoryRepo.save(history);

    entity.slug = newSlug;
  }
}
