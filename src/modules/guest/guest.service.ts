import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { GuestEntity } from '@/entities';
import {
  GuestGroupRepository,
  GuestRepository,
  InvitationRepository,
} from '@/repositories';
import {
  assertInvitationModule,
  assertPublishedInvitation,
  generateInvitationCode,
  resolveGuestGroupCode,
  toCardViewModel,
} from '@/utils/invitation.utils';
import { isAdminUser } from '@/utils/owner.utils';
import { getActivePlanLimits } from '@/utils/quota.utils';
import { buildShareUrl } from '@/utils/slug.utils';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as QRCode from 'qrcode';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateGuestDto,
  CreateManyGuestsDto,
  FilterGuestDto,
  IdentifyGuestDto,
  RsvpGuestDto,
  UpdateGuestDto,
} from './dto';
@Injectable()
export class GuestService {
  constructor(
    private readonly repo: GuestRepository,
    private readonly invitationRepo: InvitationRepository,
    private readonly guestGroupRepo: GuestGroupRepository,
  ) {}

  /* ============================================================
   * HELPER: Xác thực quyền sở hữu thiệp
   * ============================================================ */
  private async assertOwnership(
    invitationId: string,
    user: UserDto,
    action: string,
  ) {
    const invitation = await this.invitationRepo.findOne({
      where: { id: invitationId, isDeleted: false },
    });

    if (!invitation) {
      throw new NotFoundException('Không tìm thấy thiệp');
    }

    if (!isAdminUser(user) && invitation.userId !== user.id) {
      throw new ForbiddenException(`Bạn không có quyền ${action}`);
    }

    return invitation;
  }

  /* ============================================================
   * HELPER: Build where filter
   * ============================================================ */
  private buildWhere(
    filter: FilterGuestDto,
    user?: UserDto,
  ): FindOptionsWhere<GuestEntity> {
    const where: FindOptionsWhere<GuestEntity> = { isDeleted: false };

    if (filter.invitationId) where.invitationId = filter.invitationId;
    if (filter.tableId) where.tableId = filter.tableId;
    if (filter.fullName) where.fullName = ILike(`%${filter.fullName}%`);
    if (filter.salutation) where.salutation = filter.salutation;
    if (filter.groupId) where.groupId = filter.groupId;
    if (filter.isVip !== undefined) where.isVip = filter.isVip;
    if (filter.invitationCode) where.invitationCode = filter.invitationCode;
    if (filter.rsvpStatus) where.rsvpStatus = filter.rsvpStatus;
    if (filter.attendingCount !== undefined) {
      where.attendingCount = filter.attendingCount;
    }
    if (filter.needsTransport !== undefined) {
      where.needsTransport = filter.needsTransport;
    }

    return where;
  }

  /* ============================================================
   * PAGINATION
   * ============================================================ */
  async pagination(data: PaginationDto<FilterGuestDto>, user?: UserDto) {
    const { skip = 0, take = 10, where = {} } = data;

    // Nếu là user thường → giới hạn theo thiệp của họ
    if (user && !isAdminUser(user)) {
      if (where.invitationId) {
        await this.assertOwnership(
          where.invitationId,
          user,
          'xem khách mời của thiệp này',
        );
      } else {
        const invitations = await this.invitationRepo.find({
          where: { userId: user.id, isDeleted: false },
          select: { id: true },
        });
        if (!invitations.length) {
          return { data: [], total: 0 };
        }
        where.invitationId = undefined; // tránh conflict
        // Gán danh sách ID thiệp vào where sau khi build
        const whereCon = this.buildWhere(where);
        whereCon.invitationId = In(invitations.map((w) => w.id));

        const [list, total] = await this.repo.findAndCount({
          where: whereCon,
          relations: { group: true, invitation: true },
          skip,
          take,
          order: { createdAt: 'DESC' },
        });
        return { data: list, total };
      }
    }

    const whereCon = this.buildWhere(where);
    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: { group: true, invitation: true },
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
      relations: { group: true, invitation: true },
    });

    if (!item) throw new NotFoundException('Không tìm thấy khách mời');

    if (user && !isAdminUser(user)) {
      await this.assertOwnership(item.invitationId, user, 'xem khách mời này');
    }

    return { message: 'Thành công', data: item };
  }

  /* ============================================================
   * CREATE
   * ============================================================ */
  async create(user: UserDto, dto: CreateGuestDto) {
    const invitation = await this.assertOwnership(
      dto.invitationId,
      user,
      'thêm khách mời vào thiệp này',
    );

    await this.assertGuestQuota(invitation.userId, dto.invitationId, 1);

    const entity = this.repo.create({
      id: uuidv4(),
      invitationId: dto.invitationId,
      tableId: dto.tableId,
      fullName: dto.fullName,
      salutation: dto.salutation || 'Kính mời',
      phone: dto.phone,
      email: dto.email,
      groupId: await this.resolveGroupId(
        dto.invitationId,
        dto.groupId,
        dto.groupCode,
      ),
      isVip: dto.isVip ?? false,
      invitationCode: dto.invitationCode || generateInvitationCode(),
      qrCodeUrl: dto.qrCodeUrl,
      rsvpStatus: dto.rsvpStatus || enumData.RSVP_STATUS.PENDING.code,
      attendingCount: dto.attendingCount ?? 1,
      needsTransport: dto.needsTransport ?? false,
      rsvpNote: dto.rsvpNote,
      rsvpAt: dto.rsvpAt,
      invitedAt: dto.invitedAt,
      invitationViewedAt: dto.invitationViewedAt,
      createdBy: user.id,
    });

    const saved = await this.repo.save(entity);
    return { message: 'Tạo khách mời thành công', data: saved };
  }

  /* ============================================================
   * CREATE MANY
   * ============================================================ */
  async createMany(user: UserDto, dto: CreateManyGuestsDto) {
    const invitation = await this.assertOwnership(
      dto.invitationId,
      user,
      'thêm khách mời vào thiệp này',
    );

    await this.assertGuestQuota(
      invitation.userId,
      dto.invitationId,
      dto.guests.length,
    );

    const entities: GuestEntity[] = [];
    for (const g of dto.guests) {
      entities.push(
        this.repo.create({
          id: uuidv4(),
          invitationId: dto.invitationId,
          tableId: g.tableId,
          fullName: g.fullName,
          salutation: g.salutation || 'Kính mời',
          phone: g.phone,
          email: g.email,
          groupId: await this.resolveGroupId(
            dto.invitationId,
            g.groupId,
            g.groupCode,
          ),
          isVip: g.isVip ?? false,
          invitationCode: g.invitationCode || generateInvitationCode(),
          qrCodeUrl: g.qrCodeUrl,
          rsvpStatus: g.rsvpStatus || enumData.RSVP_STATUS.PENDING.code,
          attendingCount: g.attendingCount ?? 1,
          needsTransport: g.needsTransport ?? false,
          rsvpNote: g.rsvpNote,
          createdBy: user.id,
        }),
      );
    }

    const saved = await this.repo.save(entities);
    return {
      message: `Tạo thành công ${saved.length} khách mời`,
      data: saved,
    };
  }

  /* ============================================================
   * UPDATE
   * ============================================================ */
  async update(dto: UpdateGuestDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy khách mời');

    await this.assertOwnership(
      entity.invitationId,
      user,
      'chỉnh sửa khách mời này',
    );

    if (dto.tableId !== undefined) entity.tableId = dto.tableId;
    if (dto.fullName !== undefined) entity.fullName = dto.fullName;
    if (dto.salutation !== undefined) entity.salutation = dto.salutation;
    if (dto.phone !== undefined) entity.phone = dto.phone;
    if (dto.email !== undefined) entity.email = dto.email;
    if (dto.groupId !== undefined || dto.groupCode !== undefined) {
      entity.groupId = await this.resolveGroupId(
        entity.invitationId,
        dto.groupId,
        dto.groupCode,
      );
    }
    if (dto.isVip !== undefined) entity.isVip = dto.isVip;
    if (dto.invitationCode !== undefined) {
      entity.invitationCode = dto.invitationCode;
    }
    if (dto.qrCodeUrl !== undefined) entity.qrCodeUrl = dto.qrCodeUrl;
    if (dto.rsvpStatus !== undefined) entity.rsvpStatus = dto.rsvpStatus;
    if (dto.attendingCount !== undefined) {
      entity.attendingCount = dto.attendingCount;
    }
    if (dto.needsTransport !== undefined) {
      entity.needsTransport = dto.needsTransport;
    }
    if (dto.rsvpNote !== undefined) entity.rsvpNote = dto.rsvpNote;
    if (dto.rsvpAt !== undefined) entity.rsvpAt = dto.rsvpAt;
    if (dto.invitedAt !== undefined) entity.invitedAt = dto.invitedAt;
    if (dto.invitationViewedAt !== undefined) {
      entity.invitationViewedAt = dto.invitationViewedAt;
    }

    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật khách mời thành công', data: saved };
  }

  /* ============================================================
   * DELETE (soft)
   * ============================================================ */
  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy khách mời');

    await this.assertOwnership(entity.invitationId, user, 'xóa khách mời này');

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);

    return { message: 'Xóa khách mời thành công' };
  }

  /* ============================================================
   * PUBLIC — RSVP
   * ============================================================ */
  async rsvp(dto: RsvpGuestDto) {
    const guest = await this.repo.findOne({
      where: { invitationCode: dto.invitationCode, isDeleted: false },
    });
    if (!guest) throw new NotFoundException('Mã mời không chính xác');

    const invitation = await this.invitationRepo.findOne({
      where: { id: guest.invitationId, isDeleted: false },
    });
    assertPublishedInvitation(invitation);
    assertInvitationModule(
      invitation!,
      enumData.INVITATION_MODULE.RSVP.code,
      'Thiệp này không bật tính năng xác nhận tham dự',
    );

    if (dto.rsvpStatus !== undefined) guest.rsvpStatus = dto.rsvpStatus;
    if (dto.attendingCount !== undefined) {
      guest.attendingCount = dto.attendingCount;
    }
    if (dto.needsTransport !== undefined) {
      guest.needsTransport = dto.needsTransport;
    }
    if (dto.rsvpNote !== undefined) guest.rsvpNote = dto.rsvpNote;
    guest.rsvpAt = new Date();

    const saved = await this.repo.save(guest);
    return { message: 'Gửi RSVP thành công', data: saved };
  }

  /* ============================================================
   * PUBLIC — IDENTIFY
   * ============================================================ */
  async identify(dto: IdentifyGuestDto) {
    const guest = await this.repo.findOne({
      where: { invitationCode: dto.invitationCode, isDeleted: false },
    });
    if (!guest) throw new NotFoundException('Mã mời không chính xác');

    guest.invitationViewedAt = new Date();
    await this.repo.save(guest);

    const invitation = await this.invitationRepo.findOne({
      where: { id: guest.invitationId, isDeleted: false },
      relations: {
        events: true,
        timelines: true,
        photos: true,
        template: true,
        hosts: true,
        gifts: true,
        guestGroups: true,
        weddingInfo: true,
        music: true,
      },
    });
    assertPublishedInvitation(invitation);

    return {
      message: 'Nhận diện khách mời thành công',
      data: {
        guest,
        invitation: toCardViewModel(invitation),
      },
    };
  }

  /* ============================================================
   * STATS
   * ============================================================ */
  async getStats(invitationId: string) {
    const guests = await this.repo.find({
      where: { invitationId, isDeleted: false },
    });

    const total = guests.length;
    const attending = guests.filter(
      (g) => g.rsvpStatus === enumData.RSVP_STATUS.ATTENDING.code,
    ).length;
    const declined = guests.filter(
      (g) => g.rsvpStatus === enumData.RSVP_STATUS.DECLINED.code,
    ).length;
    const pending = guests.filter(
      (g) => g.rsvpStatus === enumData.RSVP_STATUS.PENDING.code,
    ).length;
    const attendingGuests = guests
      .filter((g) => g.rsvpStatus === enumData.RSVP_STATUS.ATTENDING.code)
      .reduce((sum, g) => sum + (g.attendingCount || 0), 0);
    const needsTransport = guests.filter((g) => g.needsTransport).length;

    return {
      message: 'Thống kê khách mời',
      data: {
        total,
        attending,
        declined,
        pending,
        attendingGuests,
        needsTransport,
      },
    };
  }

  /* ============================================================
   * GENERATE QR
   * ============================================================ */
  async generateQrCode(id: string, user: UserDto) {
    const guest = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!guest) throw new NotFoundException('Không tìm thấy khách mời');

    const invitation = await this.assertOwnership(
      guest.invitationId,
      user,
      'tạo mã QR cho khách mời này',
    );

    const invitationUrl = `${buildShareUrl(invitation.slug)}?code=${guest.invitationCode}`;

    try {
      guest.qrCodeUrl = await QRCode.toDataURL(invitationUrl);
    } catch {
      throw new BadRequestException('Lỗi khi tạo mã QR');
    }

    await this.repo.save(guest);
    return {
      message: 'Tạo mã QR thành công',
      data: { qrCodeUrl: guest.qrCodeUrl },
    };
  }

  /* ============================================================
   * IMPORT EXCEL
   * ============================================================ */
  async importExcel(invitationId: string, buffer: Buffer, user: UserDto) {
    const invitation = await this.assertOwnership(
      invitationId,
      user,
      'thêm khách mời vào thiệp này',
    );

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new BadRequestException('File Excel không có sheet nào');
    }

    const getCellValueString = (val: any): string => {
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') {
        if (val.richText) {
          return val.richText.map((t: any) => t.text || '').join('');
        }
        if (val.text) return val.text;
        if (val.result !== undefined && val.result !== null) {
          return val.result.toString();
        }
        if (val instanceof Date) return val.toISOString();
      }
      return val.toString().trim();
    };

    const guests: GuestEntity[] = [];
    const rows: Array<{
      fullName: string;
      salutation: string;
      groupCode?: string;
      isVip: boolean;
    }> = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // bỏ header
      const fullName = getCellValueString(row.getCell(1).value);
      if (!fullName) return;
      const isVipStr = getCellValueString(row.getCell(6).value).toLowerCase();
      rows.push({
        fullName,
        salutation: getCellValueString(row.getCell(4).value) || 'Kính mời',
        groupCode: resolveGuestGroupCode(
          getCellValueString(row.getCell(5).value),
        ),
        isVip: ['true', '1', 'yes'].includes(isVipStr),
      });
    });

    for (const row of rows) {
      guests.push(
        this.repo.create({
          id: uuidv4(),
          invitationId,
          fullName: row.fullName,
          salutation: row.salutation,
          groupId: await this.resolveGroupId(
            invitationId,
            undefined,
            row.groupCode,
          ),
          rsvpStatus: enumData.RSVP_STATUS.PENDING.code,
          attendingCount: 1,
          needsTransport: false,
          isVip: row.isVip,
          invitationCode: generateInvitationCode(),
          createdBy: user.id,
        }),
      );
    }

    if (guests.length > 0) {
      await this.assertGuestQuota(
        invitation.userId,
        invitationId,
        guests.length,
      );
      await this.repo.save(guests);
    }

    return {
      message: `Import thành công ${guests.length} khách mời`,
      data: guests,
    };
  }

  /* ============================================================
   * DOWNLOAD SAMPLE EXCEL
   * ============================================================ */
  async downloadSampleExcel(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Mau khach moi');

    worksheet.columns = [
      { header: 'Họ tên', key: 'fullName', width: 30 },
      { header: 'Số điện thoại', key: 'phone', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Danh xưng', key: 'salutation', width: 15 },
      { header: 'Nhóm khách (mã)', key: 'groupCode', width: 22 },
      { header: 'VIP (true/false)', key: 'isVip', width: 18 },
      { header: 'Cần đưa đón (true/false)', key: 'needsTransport', width: 22 },
    ];

    worksheet.addRow({
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'a@example.com',
      salutation: 'Anh',
      groupCode: enumData.GUEST_GROUP.FRIENDS.code,
      isVip: 'false',
      needsTransport: 'false',
    });

    worksheet.addRow({
      fullName: 'Trần Thị B',
      phone: '0912345678',
      email: 'b@example.com',
      salutation: 'Chị',
      groupCode: enumData.GUEST_GROUP.FAMILY.code,
      isVip: 'true',
      needsTransport: 'true',
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /* ============================================================
   * PRIVATE — Resolve group ID từ groupId hoặc groupCode
   * ============================================================ */
  private async resolveGroupId(
    invitationId: string | undefined,
    groupId?: string,
    groupCode?: string,
  ): Promise<string | undefined> {
    if (groupId) return groupId;

    const code = resolveGuestGroupCode(groupCode) || groupCode;
    if (!invitationId || !code) return undefined;

    const group = await this.guestGroupRepo.findOne({
      where: { invitationId, code, isDeleted: false },
    });
    return group?.id;
  }

  /* ============================================================
   * PRIVATE — Kiểm tra quota khách mời theo gói dịch vụ
   * ============================================================ */
  private async assertGuestQuota(
    userId: string,
    invitationId: string,
    incoming: number,
  ) {
    const current = await this.repo.count({
      where: { invitationId, isDeleted: false },
    });
    const { maxGuests } = await getActivePlanLimits(this.repo.manager, userId);

    if (current + incoming > maxGuests) {
      throw new ForbiddenException(
        `Gói hiện tại cho phép tối đa ${maxGuests} khách mời`,
      );
    }
  }
}
