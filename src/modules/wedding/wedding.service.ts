import { IdDto, PaginationDto, UserDto } from '@/dto';
import {
  DietaryPref,
  RsvpStatus,
  SlugHistoryEntity,
  WeddingEntity,
  WeddingStatus,
} from '@/entities';
import {
  GuestRepository,
  SlugHistoryRepository,
  TableRepository,
  WeddingRepository,
  WishRepository,
} from '@/repositories';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as QRCode from 'qrcode';
import { Brackets, FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateWeddingDto, FilterWeddingDto, UpdateWeddingDto } from './dto';

@Injectable()
export class WeddingService {
  constructor(
    private readonly repo: WeddingRepository,
    private readonly slugHistoryRepo: SlugHistoryRepository,
    private readonly guestRepo: GuestRepository,
    private readonly tableRepo: TableRepository,
    private readonly wishRepo: WishRepository,
  ) {}

  async pagination(data: PaginationDto<FilterWeddingDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<WeddingEntity> = { isDeleted: false };

    if (where.userId !== undefined) whereCon.userId = where.userId;
    if (where.templateId !== undefined) whereCon.templateId = where.templateId;
    if (where.slug !== undefined) whereCon.slug = where.slug;
    if (where.groomName !== undefined) whereCon.groomName = where.groomName;
    if (where.groomDob !== undefined) whereCon.groomDob = where.groomDob;
    if (where.groomFatherName !== undefined)
      whereCon.groomFatherName = where.groomFatherName;
    if (where.groomMotherName !== undefined)
      whereCon.groomMotherName = where.groomMotherName;
    if (where.groomPhotoUrl !== undefined)
      whereCon.groomPhotoUrl = where.groomPhotoUrl;
    if (where.brideName !== undefined) whereCon.brideName = where.brideName;
    if (where.brideDob !== undefined) whereCon.brideDob = where.brideDob;
    if (where.brideFatherName !== undefined)
      whereCon.brideFatherName = where.brideFatherName;
    if (where.brideMotherName !== undefined)
      whereCon.brideMotherName = where.brideMotherName;
    if (where.bridePhotoUrl !== undefined)
      whereCon.bridePhotoUrl = where.bridePhotoUrl;
    if (where.engagementAt !== undefined)
      whereCon.engagementAt = where.engagementAt;
    if (where.engagementVenue !== undefined)
      whereCon.engagementVenue = where.engagementVenue;
    if (where.engagementAddress !== undefined)
      whereCon.engagementAddress = where.engagementAddress;
    if (where.engagementMapsUrl !== undefined)
      whereCon.engagementMapsUrl = where.engagementMapsUrl;
    if (where.ceremonyAt !== undefined) whereCon.ceremonyAt = where.ceremonyAt;
    if (where.ceremonyVenue !== undefined)
      whereCon.ceremonyVenue = where.ceremonyVenue;
    if (where.ceremonyAddress !== undefined)
      whereCon.ceremonyAddress = where.ceremonyAddress;
    if (where.ceremonyMapsUrl !== undefined)
      whereCon.ceremonyMapsUrl = where.ceremonyMapsUrl;
    if (where.ceremonyLat !== undefined)
      whereCon.ceremonyLat = where.ceremonyLat;
    if (where.ceremonyLng !== undefined)
      whereCon.ceremonyLng = where.ceremonyLng;
    if (where.receptionAt !== undefined)
      whereCon.receptionAt = where.receptionAt;
    if (where.receptionVenue !== undefined)
      whereCon.receptionVenue = where.receptionVenue;
    if (where.receptionAddress !== undefined)
      whereCon.receptionAddress = where.receptionAddress;
    if (where.receptionMapsUrl !== undefined)
      whereCon.receptionMapsUrl = where.receptionMapsUrl;
    if (where.receptionLat !== undefined)
      whereCon.receptionLat = where.receptionLat;
    if (where.receptionLng !== undefined)
      whereCon.receptionLng = where.receptionLng;
    if (where.invitationText !== undefined)
      whereCon.invitationText = where.invitationText;
    if (where.loveStory !== undefined) whereCon.loveStory = where.loveStory;
    if (where.hashtag !== undefined) whereCon.hashtag = where.hashtag;
    if (where.musicUrl !== undefined) whereCon.musicUrl = where.musicUrl;
    if (where.musicType !== undefined) whereCon.musicType = where.musicType;
    if (where.musicAutoplay !== undefined)
      whereCon.musicAutoplay = where.musicAutoplay;
    if (where.bankAccountNumber !== undefined)
      whereCon.bankAccountNumber = where.bankAccountNumber;
    if (where.bankName !== undefined) whereCon.bankName = where.bankName;
    if (where.bankAccountName !== undefined)
      whereCon.bankAccountName = where.bankAccountName;
    if (where.bankTransferNote !== undefined)
      whereCon.bankTransferNote = where.bankTransferNote;
    if (where.vietqrUrl !== undefined) whereCon.vietqrUrl = where.vietqrUrl;
    if (where.status !== undefined) whereCon.status = where.status;
    if (where.publishedAt !== undefined)
      whereCon.publishedAt = where.publishedAt;
    if (where.expiresAt !== undefined) whereCon.expiresAt = where.expiresAt;

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

  async create(user: UserDto, dto: CreateWeddingDto) {
    const entity = new WeddingEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.userId !== undefined) entity.userId = dto.userId;
    if (dto.templateId !== undefined) entity.templateId = dto.templateId;

    if (dto.slug !== undefined) {
      const isAvailable = await this.checkSlugAvailable(dto.slug);
      if (!isAvailable) {
        throw new ConflictException('Slug đã tồn tại hoặc không hợp lệ');
      }
      entity.slug = dto.slug;
    }

    if (dto.groomName !== undefined) entity.groomName = dto.groomName;
    if (dto.groomDob !== undefined) entity.groomDob = dto.groomDob;
    if (dto.groomFatherName !== undefined)
      entity.groomFatherName = dto.groomFatherName;
    if (dto.groomMotherName !== undefined)
      entity.groomMotherName = dto.groomMotherName;
    if (dto.groomPhotoUrl !== undefined)
      entity.groomPhotoUrl = dto.groomPhotoUrl;
    if (dto.brideName !== undefined) entity.brideName = dto.brideName;
    if (dto.brideDob !== undefined) entity.brideDob = dto.brideDob;
    if (dto.brideFatherName !== undefined)
      entity.brideFatherName = dto.brideFatherName;
    if (dto.brideMotherName !== undefined)
      entity.brideMotherName = dto.brideMotherName;
    if (dto.bridePhotoUrl !== undefined)
      entity.bridePhotoUrl = dto.bridePhotoUrl;
    if (dto.engagementAt !== undefined) entity.engagementAt = dto.engagementAt;
    if (dto.engagementVenue !== undefined)
      entity.engagementVenue = dto.engagementVenue;
    if (dto.engagementAddress !== undefined)
      entity.engagementAddress = dto.engagementAddress;
    if (dto.engagementMapsUrl !== undefined)
      entity.engagementMapsUrl = dto.engagementMapsUrl;
    if (dto.ceremonyAt !== undefined) entity.ceremonyAt = dto.ceremonyAt;
    if (dto.ceremonyVenue !== undefined)
      entity.ceremonyVenue = dto.ceremonyVenue;
    if (dto.ceremonyAddress !== undefined)
      entity.ceremonyAddress = dto.ceremonyAddress;
    if (dto.ceremonyMapsUrl !== undefined)
      entity.ceremonyMapsUrl = dto.ceremonyMapsUrl;
    if (dto.ceremonyLat !== undefined) entity.ceremonyLat = dto.ceremonyLat;
    if (dto.ceremonyLng !== undefined) entity.ceremonyLng = dto.ceremonyLng;
    if (dto.receptionAt !== undefined) entity.receptionAt = dto.receptionAt;
    if (dto.receptionVenue !== undefined)
      entity.receptionVenue = dto.receptionVenue;
    if (dto.receptionAddress !== undefined)
      entity.receptionAddress = dto.receptionAddress;
    if (dto.receptionMapsUrl !== undefined)
      entity.receptionMapsUrl = dto.receptionMapsUrl;
    if (dto.receptionLat !== undefined) entity.receptionLat = dto.receptionLat;
    if (dto.receptionLng !== undefined) entity.receptionLng = dto.receptionLng;
    if (dto.invitationText !== undefined)
      entity.invitationText = dto.invitationText;
    if (dto.loveStory !== undefined) entity.loveStory = dto.loveStory;
    if (dto.hashtag !== undefined) entity.hashtag = dto.hashtag;
    if (dto.musicUrl !== undefined) entity.musicUrl = dto.musicUrl;
    if (dto.musicType !== undefined) entity.musicType = dto.musicType;
    if (dto.musicAutoplay !== undefined)
      entity.musicAutoplay = dto.musicAutoplay;
    if (dto.bankAccountNumber !== undefined)
      entity.bankAccountNumber = dto.bankAccountNumber;
    if (dto.bankName !== undefined) entity.bankName = dto.bankName;
    if (dto.bankAccountName !== undefined)
      entity.bankAccountName = dto.bankAccountName;
    if (dto.bankTransferNote !== undefined)
      entity.bankTransferNote = dto.bankTransferNote;
    if (dto.vietqrUrl !== undefined) entity.vietqrUrl = dto.vietqrUrl;
    if (dto.status !== undefined) entity.status = dto.status;
    if (dto.publishedAt !== undefined) entity.publishedAt = dto.publishedAt;
    if (dto.expiresAt !== undefined) entity.expiresAt = dto.expiresAt;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateWeddingDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    if (!user.isAdmin && entity.userId !== user.id) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa đám cưới này');
    }

    entity.updatedBy = user.id;

    if (dto.userId !== undefined) entity.userId = dto.userId;
    if (dto.templateId !== undefined) entity.templateId = dto.templateId;

    if (dto.slug !== undefined && entity.slug !== dto.slug) {
      const isAvailable = await this.checkSlugAvailable(dto.slug);
      if (!isAvailable) {
        throw new ConflictException('Slug đã tồn tại hoặc không hợp lệ');
      }

      // Save to slug history
      const history = new SlugHistoryEntity();
      history.id = uuidv4();
      history.weddingId = entity.id;
      history.oldSlug = entity.slug;
      history.newSlug = dto.slug;
      history.changedBy = user.id;
      history.reason = dto.slugReason || 'User updated slug';
      await this.slugHistoryRepo.save(history);

      entity.slug = dto.slug;
    }

    if (dto.groomName !== undefined) entity.groomName = dto.groomName;
    if (dto.groomDob !== undefined) entity.groomDob = dto.groomDob;
    if (dto.groomFatherName !== undefined)
      entity.groomFatherName = dto.groomFatherName;
    if (dto.groomMotherName !== undefined)
      entity.groomMotherName = dto.groomMotherName;
    if (dto.groomPhotoUrl !== undefined)
      entity.groomPhotoUrl = dto.groomPhotoUrl;
    if (dto.brideName !== undefined) entity.brideName = dto.brideName;
    if (dto.brideDob !== undefined) entity.brideDob = dto.brideDob;
    if (dto.brideFatherName !== undefined)
      entity.brideFatherName = dto.brideFatherName;
    if (dto.brideMotherName !== undefined)
      entity.brideMotherName = dto.brideMotherName;
    if (dto.bridePhotoUrl !== undefined)
      entity.bridePhotoUrl = dto.bridePhotoUrl;
    if (dto.engagementAt !== undefined) entity.engagementAt = dto.engagementAt;
    if (dto.engagementVenue !== undefined)
      entity.engagementVenue = dto.engagementVenue;
    if (dto.engagementAddress !== undefined)
      entity.engagementAddress = dto.engagementAddress;
    if (dto.engagementMapsUrl !== undefined)
      entity.engagementMapsUrl = dto.engagementMapsUrl;
    if (dto.ceremonyAt !== undefined) entity.ceremonyAt = dto.ceremonyAt;
    if (dto.ceremonyVenue !== undefined)
      entity.ceremonyVenue = dto.ceremonyVenue;
    if (dto.ceremonyAddress !== undefined)
      entity.ceremonyAddress = dto.ceremonyAddress;
    if (dto.ceremonyMapsUrl !== undefined)
      entity.ceremonyMapsUrl = dto.ceremonyMapsUrl;
    if (dto.ceremonyLat !== undefined) entity.ceremonyLat = dto.ceremonyLat;
    if (dto.ceremonyLng !== undefined) entity.ceremonyLng = dto.ceremonyLng;
    if (dto.receptionAt !== undefined) entity.receptionAt = dto.receptionAt;
    if (dto.receptionVenue !== undefined)
      entity.receptionVenue = dto.receptionVenue;
    if (dto.receptionAddress !== undefined)
      entity.receptionAddress = dto.receptionAddress;
    if (dto.receptionMapsUrl !== undefined)
      entity.receptionMapsUrl = dto.receptionMapsUrl;
    if (dto.receptionLat !== undefined) entity.receptionLat = dto.receptionLat;
    if (dto.receptionLng !== undefined) entity.receptionLng = dto.receptionLng;
    if (dto.invitationText !== undefined)
      entity.invitationText = dto.invitationText;
    if (dto.loveStory !== undefined) entity.loveStory = dto.loveStory;
    if (dto.hashtag !== undefined) entity.hashtag = dto.hashtag;
    if (dto.musicUrl !== undefined) entity.musicUrl = dto.musicUrl;
    if (dto.musicType !== undefined) entity.musicType = dto.musicType;
    if (dto.musicAutoplay !== undefined)
      entity.musicAutoplay = dto.musicAutoplay;
    if (dto.bankAccountNumber !== undefined)
      entity.bankAccountNumber = dto.bankAccountNumber;
    if (dto.bankName !== undefined) entity.bankName = dto.bankName;
    if (dto.bankAccountName !== undefined)
      entity.bankAccountName = dto.bankAccountName;
    if (dto.bankTransferNote !== undefined)
      entity.bankTransferNote = dto.bankTransferNote;
    if (dto.vietqrUrl !== undefined) entity.vietqrUrl = dto.vietqrUrl;
    if (dto.status !== undefined) entity.status = dto.status;
    if (dto.publishedAt !== undefined) entity.publishedAt = dto.publishedAt;
    if (dto.expiresAt !== undefined) entity.expiresAt = dto.expiresAt;

    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật thành công', data: saved };
  }

  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    if (!user.isAdmin && entity.userId !== user.id) {
      throw new ForbiddenException('Bạn không có quyền xóa đám cưới này');
    }

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xóa thành công' };
  }

  async checkSlugAvailable(slug: string): Promise<boolean> {
    const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{3,58}[a-z0-9]$/;
    if (!SLUG_REGEX.test(slug)) return false;

    const reserved = [
      'manage',
      'admin',
      'api',
      'login',
      'register',
      'pricing',
      'logout',
      'thiep',
    ];
    if (reserved.includes(slug.toLowerCase())) return false;

    const graceDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const existing = await this.repo
      .createQueryBuilder('w')
      .where('w.slug = :slug', { slug })
      .andWhere('w.isDeleted = false')
      .andWhere(
        new Brackets((qb) => {
          qb.where('w.status IN (:...statuses)', {
            statuses: [WeddingStatus.DRAFT, WeddingStatus.PUBLISHED],
          }).orWhere('w.status = :archived AND w.updatedAt > :graceDate', {
            archived: WeddingStatus.ARCHIVED,
            graceDate,
          });
        }),
      )
      .getOne();

    return !existing;
  }

  async generateSlugSuggestion(slug: string): Promise<string> {
    let suffix = 1;
    while (true) {
      const candidate = `${slug}-${suffix === 1 ? '2026' : suffix}`;
      const isAvailable = await this.checkSlugAvailable(candidate);
      if (isAvailable) {
        return candidate;
      }
      suffix++;
    }
  }

  async findBySlug(slug: string): Promise<WeddingEntity> {
    const item = await this.repo.findOne({
      where: { slug, isDeleted: false } as any,
    });
    if (!item) throw new NotFoundException('Không tìm thấy thiệp cưới');
    return item;
  }

  async publish(id: string, user: UserDto): Promise<any> {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy đám cưới');

    if (!user.isAdmin && entity.userId !== user.id) {
      throw new ForbiddenException('Bạn không có quyền xuất bản đám cưới này');
    }

    entity.status = WeddingStatus.PUBLISHED;
    entity.publishedAt = new Date();
    entity.shareUrl = `https://wedding.vn/thiep/${entity.slug}`;
    try {
      entity.shareQrUrl = await QRCode.toDataURL(entity.shareUrl);
    } catch (err) {
      entity.shareQrUrl = '';
    }

    const saved = await this.repo.save(entity);
    return { message: 'Xuất bản thành công', data: saved };
  }

  async getShareUrl(id: string, user: UserDto): Promise<any> {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy đám cưới');

    if (!user.isAdmin && entity.userId !== user.id) {
      throw new ForbiddenException(
        'Bạn không có quyền xem thông tin chia sẻ của đám cưới này',
      );
    }

    const shareUrl =
      entity.shareUrl || `https://wedding.vn/thiep/${entity.slug}`;
    let qrCodeBase64 = entity.shareQrUrl;
    if (!qrCodeBase64) {
      try {
        qrCodeBase64 = await QRCode.toDataURL(shareUrl);
      } catch (err) {
        qrCodeBase64 = '';
      }
    }

    return { shareUrl, qrCodeBase64 };
  }

  async getStats(id: string, user: UserDto): Promise<any> {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy đám cưới');

    if (!user.isAdmin && entity.userId !== user.id) {
      throw new ForbiddenException(
        'Bạn không có quyền xem thống kê của đám cưới này',
      );
    }

    const [totalGuests, pendingCount, attendingCount, declinedCount] =
      await Promise.all([
        this.guestRepo.count({ where: { weddingId: id, isDeleted: false } }),
        this.guestRepo.count({
          where: {
            weddingId: id,
            rsvpStatus: RsvpStatus.PENDING,
            isDeleted: false,
          },
        }),
        this.guestRepo.count({
          where: {
            weddingId: id,
            rsvpStatus: RsvpStatus.ATTENDING,
            isDeleted: false,
          },
        }),
        this.guestRepo.count({
          where: {
            weddingId: id,
            rsvpStatus: RsvpStatus.DECLINED,
            isDeleted: false,
          },
        }),
      ]);

    const attendingGuests = await this.guestRepo.find({
      where: {
        weddingId: id,
        rsvpStatus: RsvpStatus.ATTENDING,
        isDeleted: false,
      },
    });
    const totalAttendingSeats = attendingGuests.reduce(
      (sum, g) => sum + (g.attendingCount || 1),
      0,
    );

    const [dietNormal, dietVeg, dietHalal, dietOther, needsTransport] =
      await Promise.all([
        this.guestRepo.count({
          where: {
            weddingId: id,
            dietary: DietaryPref.NORMAL,
            rsvpStatus: RsvpStatus.ATTENDING,
            isDeleted: false,
          },
        }),
        this.guestRepo.count({
          where: {
            weddingId: id,
            dietary: DietaryPref.VEGETARIAN,
            rsvpStatus: RsvpStatus.ATTENDING,
            isDeleted: false,
          },
        }),
        this.guestRepo.count({
          where: {
            weddingId: id,
            dietary: DietaryPref.HALAL,
            rsvpStatus: RsvpStatus.ATTENDING,
            isDeleted: false,
          },
        }),
        this.guestRepo.count({
          where: {
            weddingId: id,
            dietary: DietaryPref.OTHER,
            rsvpStatus: RsvpStatus.ATTENDING,
            isDeleted: false,
          },
        }),
        this.guestRepo.count({
          where: {
            weddingId: id,
            needsTransport: true,
            rsvpStatus: RsvpStatus.ATTENDING,
            isDeleted: false,
          },
        }),
      ]);

    const recentGuests = await this.guestRepo.find({
      where: { weddingId: id, isDeleted: false },
      order: { rsvpAt: 'DESC' } as any,
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
        dietary: {
          normal: dietNormal,
          vegetarian: dietVeg,
          halal: dietHalal,
          other: dietOther,
        },
        transport: {
          needsTransport,
        },
        recentGuests,
      },
    };
  }

  // ─── Admin-only operations ────────────────────────────────────────────────

  /**
   * Admin force-reset slug của wedding (vi phạm hoặc hỗ trợ kỹ thuật).
   * Tạo slug_history entry và cập nhật share_url mới.
   */
  async adminForceResetSlug(
    dto: { weddingId: string; newSlug: string; reason: string },
    user: UserDto,
  ): Promise<any> {
    const entity = await this.repo.findOne({
      where: { id: dto.weddingId, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy đám cưới');

    const isAvailable = await this.checkSlugAvailable(dto.newSlug);
    if (!isAvailable) {
      throw new ConflictException(
        `Slug "${dto.newSlug}" đã tồn tại hoặc không hợp lệ`,
      );
    }

    // Audit log
    const history = new SlugHistoryEntity();
    history.id = uuidv4();
    history.weddingId = entity.id;
    history.oldSlug = entity.slug;
    history.newSlug = dto.newSlug;
    history.changedBy = user.id;
    history.reason = dto.reason;
    await this.slugHistoryRepo.save(history);

    const oldSlug = entity.slug;
    entity.slug = dto.newSlug;

    // Cập nhật share_url nếu đã publish
    if (entity.shareUrl) {
      entity.shareUrl = `https://wedding.vn/thiep/${dto.newSlug}`;
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
      data: { oldSlug, newSlug: dto.newSlug, wedding: saved },
    };
  }

  /**
   * Unpublish / archive một đám cưới (Admin hoặc owner).
   */
  async unpublish(id: string, user: UserDto): Promise<any> {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy đám cưới');

    if (!user.isAdmin && entity.userId !== user.id) {
      throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này');
    }

    entity.status = WeddingStatus.ARCHIVED;
    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Đã archive đám cưới', data: saved };
  }

  /**
   * Xem toàn bộ lịch sử thay đổi slug của một đám cưới (audit log).
   */
  async getSlugHistory(weddingId: string): Promise<any> {
    const history = await this.slugHistoryRepo.find({
      where: { weddingId } as any,
      order: { createdAt: 'DESC' } as any,
    });
    return { message: 'Thành công', data: history };
  }
}
