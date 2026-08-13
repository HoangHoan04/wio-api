import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { GuestEntity } from '@/entities';
import {
  GuestGroupRepository,
  GuestRepository,
  InvitationRepository,
} from '@/repositories';
import {
  generateInvitationCode,
  resolveGuestGroupCode,
} from '@/utils/invitation.utils';
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
import { FindOptionsWhere } from 'typeorm';
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

  async pagination(data: PaginationDto<FilterGuestDto>, user?: UserDto) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<GuestEntity> = { isDeleted: false };

    if (user && !user.isAdmin) {
      if (where.invitationId) {
        const invitation = await this.invitationRepo.findOne({
          where: { id: where.invitationId, isDeleted: false },
        });
        if (!invitation || invitation.userId !== user.id) {
          throw new ForbiddenException(
            'Bạn không có quyền xem khách mời của thiệp này',
          );
        }
      } else {
        const invitations = await this.invitationRepo.find({
          where: { userId: user.id, isDeleted: false },
          select: ['id'],
        });
        whereCon.invitationId = invitations.map((w) => w.id) as any;
      }
    }

    if (where.invitationId !== undefined) whereCon.invitationId = where.invitationId;
    if (where.tableId !== undefined) whereCon.tableId = where.tableId;
    if (where.fullName !== undefined) whereCon.fullName = where.fullName;
    if (where.salutation !== undefined) whereCon.salutation = where.salutation;
    if (where.groupId !== undefined) whereCon.groupId = where.groupId;
    if (where.isVip !== undefined) whereCon.isVip = where.isVip;
    if (where.invitationCode !== undefined)
      whereCon.invitationCode = where.invitationCode;
    if (where.qrCodeUrl !== undefined) whereCon.qrCodeUrl = where.qrCodeUrl;
    if (where.rsvpStatus !== undefined) whereCon.rsvpStatus = where.rsvpStatus;
    if (where.attendingCount !== undefined)
      whereCon.attendingCount = where.attendingCount;

    if (where.needsTransport !== undefined)
      whereCon.needsTransport = where.needsTransport;
    if (where.rsvpNote !== undefined) whereCon.rsvpNote = where.rsvpNote;
    if (where.rsvpAt !== undefined) whereCon.rsvpAt = where.rsvpAt;
    if (where.invitedAt !== undefined) whereCon.invitedAt = where.invitedAt;
    if (where.invitationViewedAt !== undefined)
      whereCon.invitationViewedAt = where.invitationViewedAt;

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return { data: list, total };
  }

  async findById(data: IdDto, user?: UserDto) {
    const item = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!item) throw new NotFoundException('Không tìm thấy bản ghi');

    if (user && !user.isAdmin) {
      const invitation = await this.invitationRepo.findOne({
        where: { id: item.invitationId, isDeleted: false },
      });
      if (!invitation || invitation.userId !== user.id) {
        throw new ForbiddenException('Bạn không có quyền xem khách mời này');
      }
    }

    return { message: 'Thành công', data: item };
  }

  async create(user: UserDto, dto: CreateGuestDto) {
    if (dto.invitationId) {
      const invitation = await this.invitationRepo.findOne({
        where: { id: dto.invitationId },
      });
      if (!user.isAdmin && (!invitation || invitation.userId !== user.id)) {
        throw new ForbiddenException(
          'Bạn không có quyền thêm khách mời vào thiệp này',
        );
      }
      if (invitation) {
        await this.assertGuestQuota(invitation.userId, dto.invitationId, 1);
      }
    }

    const entity = new GuestEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.invitationId !== undefined) entity.invitationId = dto.invitationId;
    if (dto.tableId !== undefined) entity.tableId = dto.tableId;
    if (dto.fullName !== undefined) entity.fullName = dto.fullName;
    entity.salutation = dto.salutation || 'Kính mời';
    entity.groupId = await this.resolveGroupId(
      dto.invitationId,
      dto.groupId,
      dto.groupCode,
    );
    entity.isVip = dto.isVip ?? false;
    entity.invitationCode = dto.invitationCode || generateInvitationCode();
    if (dto.qrCodeUrl !== undefined) entity.qrCodeUrl = dto.qrCodeUrl;
    entity.rsvpStatus = dto.rsvpStatus || enumData.RSVP_STATUS.PENDING.code;
    entity.attendingCount = dto.attendingCount ?? 1;
    entity.needsTransport = dto.needsTransport ?? false;
    if (dto.rsvpNote !== undefined) entity.rsvpNote = dto.rsvpNote;
    if (dto.rsvpAt !== undefined) entity.rsvpAt = dto.rsvpAt;
    if (dto.invitedAt !== undefined) entity.invitedAt = dto.invitedAt;
    if (dto.invitationViewedAt !== undefined)
      entity.invitationViewedAt = dto.invitationViewedAt;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async createMany(user: UserDto, dto: CreateManyGuestsDto) {
    const invitation = await this.invitationRepo.findOne({
      where: { id: dto.invitationId, isDeleted: false },
    });
    if (!invitation) throw new NotFoundException('Không tìm thấy thiệp');
    if (!user.isAdmin && invitation.userId !== user.id) {
      throw new ForbiddenException(
        'Bạn không có quyền thêm khách mời vào thiệp này',
      );
    }

    await this.assertGuestQuota(
      invitation.userId,
      dto.invitationId,
      dto.guests.length,
    );

    const entities: GuestEntity[] = [];
    for (const g of dto.guests) {
      const entity = new GuestEntity();
      entity.id = uuidv4();
      entity.createdBy = user.id;
      entity.invitationId = dto.invitationId;
      if (g.tableId !== undefined) entity.tableId = g.tableId;
      entity.fullName = g.fullName;
      entity.salutation = g.salutation || 'Kính mời';
      entity.groupId = await this.resolveGroupId(
        dto.invitationId,
        g.groupId,
        g.groupCode,
      );
      entity.isVip = g.isVip ?? false;
      entity.invitationCode = g.invitationCode || generateInvitationCode();
      if (g.qrCodeUrl !== undefined) entity.qrCodeUrl = g.qrCodeUrl;
      entity.rsvpStatus = g.rsvpStatus || enumData.RSVP_STATUS.PENDING.code;
      entity.attendingCount = g.attendingCount ?? 1;
      entity.needsTransport = g.needsTransport ?? false;
      if (g.rsvpNote !== undefined) entity.rsvpNote = g.rsvpNote;
      entities.push(entity);
    }

    const saved = await this.repo.save(entities);
    return {
      message: `Tạo thành công ${saved.length} khách mờ`,
      data: saved,
    };
  }

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
      groupCode: enumData.GUEST_GROUP.GROOM.code,
      isVip: 'false',
      needsTransport: 'false',
    });

    worksheet.addRow({
      fullName: 'Trần Thị B',
      phone: '0912345678',
      email: 'b@example.com',
      salutation: 'Chị',
      groupCode: enumData.GUEST_GROUP.BRIDE.code,
      isVip: 'true',
      needsTransport: 'true',
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async update(dto: UpdateGuestDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    const invitation = await this.invitationRepo.findOne({
      where: { id: entity.invitationId },
    });
    if (!user.isAdmin && (!invitation || invitation.userId !== user.id)) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa khách mời của thiệp này',
      );
    }

    entity.updatedBy = user.id;

    if (dto.invitationId !== undefined) entity.invitationId = dto.invitationId;
    if (dto.tableId !== undefined) entity.tableId = dto.tableId;
    if (dto.fullName !== undefined) entity.fullName = dto.fullName;
    if (dto.salutation !== undefined) entity.salutation = dto.salutation;
    if (dto.groupId !== undefined || dto.groupCode !== undefined) {
      entity.groupId = await this.resolveGroupId(
        entity.invitationId,
        dto.groupId,
        dto.groupCode,
      );
    }
    if (dto.isVip !== undefined) entity.isVip = dto.isVip;
    if (dto.invitationCode !== undefined)
      entity.invitationCode = dto.invitationCode;
    if (dto.qrCodeUrl !== undefined) entity.qrCodeUrl = dto.qrCodeUrl;
    if (dto.rsvpStatus !== undefined) entity.rsvpStatus = dto.rsvpStatus;
    if (dto.attendingCount !== undefined)
      entity.attendingCount = dto.attendingCount;
    if (dto.needsTransport !== undefined)
      entity.needsTransport = dto.needsTransport;
    if (dto.rsvpNote !== undefined) entity.rsvpNote = dto.rsvpNote;
    if (dto.rsvpAt !== undefined) entity.rsvpAt = dto.rsvpAt;
    if (dto.invitedAt !== undefined) entity.invitedAt = dto.invitedAt;
    if (dto.invitationViewedAt !== undefined)
      entity.invitationViewedAt = dto.invitationViewedAt;

    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật thành công', data: saved };
  }

  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    const invitation = await this.invitationRepo.findOne({
      where: { id: entity.invitationId },
    });
    if (!user.isAdmin && (!invitation || invitation.userId !== user.id)) {
      throw new ForbiddenException('Bạn không có quyền xóa khách mời này');
    }

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xóa thành công' };
  }

  async rsvp(dto: RsvpGuestDto): Promise<any> {
    const guest = await this.repo.findOne({
      where: { invitationCode: dto.invitationCode, isDeleted: false },
    });
    if (!guest)
      throw new NotFoundException('Không tìm thấy khách mời với mã này');

    if (dto.rsvpStatus !== undefined) guest.rsvpStatus = dto.rsvpStatus;
    if (dto.attendingCount !== undefined)
      guest.attendingCount = dto.attendingCount;
    if (dto.needsTransport !== undefined)
      guest.needsTransport = dto.needsTransport;
    if (dto.rsvpNote !== undefined) guest.rsvpNote = dto.rsvpNote;
    guest.rsvpAt = new Date();

    const saved = await this.repo.save(guest);
    return { message: 'Gửi RSVP thành công', data: saved };
  }

  async identify(dto: IdentifyGuestDto): Promise<any> {
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
      },
    });

    return {
      message: 'Nhận diện khách mời thành công',
      data: {
        guest,
        invitation,
      },
    };
  }

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

  async generateQrCode(id: string, user: UserDto): Promise<any> {
    const guest = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!guest) throw new NotFoundException('Không tìm thấy khách mời');

    const invitation = await this.invitationRepo.findOne({
      where: { id: guest.invitationId, isDeleted: false },
    });

    if (!invitation) {
      throw new NotFoundException('Không tìm thấy thiệp của khách mời này');
    }

    if (!user.isAdmin && invitation.userId !== user.id) {
      throw new ForbiddenException(
        'Bạn không có quyền tạo mã QR cho khách mời này',
      );
    }

    const invitationUrl = `${buildShareUrl(invitation.slug)}?code=${guest.invitationCode}`;
    let qrCodeBase64 = '';
    try {
      qrCodeBase64 = await QRCode.toDataURL(invitationUrl);
    } catch (err) {
      throw new BadRequestException('Lỗi tạo mã QR');
    }

    guest.qrCodeUrl = qrCodeBase64;
    await this.repo.save(guest);

    return { qrCodeUrl: qrCodeBase64 };
  }

  async importExcel(
    invitationId: string,
    buffer: Buffer,
    user: UserDto,
  ): Promise<any> {
    const invitation = await this.invitationRepo.findOne({
      where: { id: invitationId, isDeleted: false },
    });
    if (!invitation) throw new NotFoundException('Không tìm thấy thiệp');

    if (!user.isAdmin && invitation.userId !== user.id) {
      throw new ForbiddenException(
        'Bạn không có quyền thêm khách mời vào thiệp này',
      );
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);
    const worksheet = workbook.worksheets[0];
    if (!worksheet)
      throw new BadRequestException('File Excel không có sheet nào');

    const getCellValueString = (val: any): string => {
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') {
        if (val.richText) {
          return val.richText.map((t: any) => t.text || '').join('');
        }
        if (val.text) {
          return val.text;
        }
        if (val.result !== undefined && val.result !== null) {
          return val.result.toString();
        }
        if (val instanceof Date) {
          return val.toISOString();
        }
      }
      return val.toString().trim();
    };

    const rows: Array<{
      fullName: string;
      salutation: string;
      groupCode?: string;
      isVip: boolean;
    }> = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const fullName = getCellValueString(row.getCell(1).value);
      if (!fullName) return;
      const isVipStr = getCellValueString(row.getCell(6).value).toLowerCase();
      rows.push({
        fullName,
        salutation: getCellValueString(row.getCell(4).value) || 'Kính mời',
        groupCode: resolveGuestGroupCode(
          getCellValueString(row.getCell(5).value),
        ),
        isVip:
          isVipStr === 'true' || isVipStr === '1' || isVipStr === 'yes',
      });
    });

    const guests: GuestEntity[] = [];
    for (const row of rows) {
      const guest = new GuestEntity();
      guest.id = uuidv4();
      guest.invitationId = invitationId;
      guest.fullName = row.fullName;
      guest.salutation = row.salutation;
      guest.groupId = await this.resolveGroupId(
        invitationId,
        undefined,
        row.groupCode,
      );
      guest.rsvpStatus = enumData.RSVP_STATUS.PENDING.code;
      guest.attendingCount = 1;
      guest.needsTransport = false;
      guest.isVip = row.isVip;
      guest.invitationCode = generateInvitationCode();
      guest.createdBy = user.id;
      guests.push(guest);
    }

    if (guests.length > 0) {
      await this.assertGuestQuota(invitation.userId, invitationId, guests.length);
      await this.repo.save(guests);
    }

    return {
      message: `Import thành công ${guests.length} khách mời`,
      data: guests,
    };
  }

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
