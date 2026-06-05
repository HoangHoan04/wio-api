import { IdDto, PaginationDto, UserDto } from '@/dto';
import { GuestEntity, GuestSide } from '@/entities';
import { GuestRepository, WeddingRepository } from '@/repositories';
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
import { CreateGuestDto, FilterGuestDto, UpdateGuestDto } from './dto';

@Injectable()
export class GuestService {
  constructor(
    private readonly repo: GuestRepository,
    private readonly weddingRepo: WeddingRepository,
  ) {}

  async pagination(data: PaginationDto<FilterGuestDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<GuestEntity> = { isDeleted: false };

    if (where.weddingId !== undefined) whereCon.weddingId = where.weddingId;
    if (where.groupId !== undefined) whereCon.groupId = where.groupId;
    if (where.tableId !== undefined) whereCon.tableId = where.tableId;
    if (where.fullName !== undefined) whereCon.fullName = where.fullName;
    if (where.phone !== undefined) whereCon.phone = where.phone;
    if (where.email !== undefined) whereCon.email = where.email;
    if (where.salutation !== undefined) whereCon.salutation = where.salutation;
    if (where.side !== undefined) whereCon.side = where.side;
    if (where.isVip !== undefined) whereCon.isVip = where.isVip;
    if (where.invitationCode !== undefined)
      whereCon.invitationCode = where.invitationCode;
    if (where.qrCodeUrl !== undefined) whereCon.qrCodeUrl = where.qrCodeUrl;
    if (where.rsvpStatus !== undefined) whereCon.rsvpStatus = where.rsvpStatus;
    if (where.attendingCount !== undefined)
      whereCon.attendingCount = where.attendingCount;
    if (where.dietary !== undefined) whereCon.dietary = where.dietary;
    if (where.dietaryNote !== undefined)
      whereCon.dietaryNote = where.dietaryNote;
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

  async create(user: UserDto, dto: CreateGuestDto) {
    if (dto.weddingId) {
      const wedding = await this.weddingRepo.findOne({
        where: { id: dto.weddingId },
      });
      if (!user.isAdmin && (!wedding || wedding.userId !== user.id)) {
        throw new ForbiddenException(
          'Bạn không có quyền thêm khách mời vào đám cưới này',
        );
      }
    }

    const entity = new GuestEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.groupId !== undefined) entity.groupId = dto.groupId;
    if (dto.tableId !== undefined) entity.tableId = dto.tableId;
    if (dto.fullName !== undefined) entity.fullName = dto.fullName;
    if (dto.phone !== undefined) entity.phone = dto.phone;
    if (dto.email !== undefined) entity.email = dto.email;
    if (dto.salutation !== undefined) entity.salutation = dto.salutation;
    if (dto.side !== undefined) entity.side = dto.side;
    if (dto.isVip !== undefined) entity.isVip = dto.isVip;
    entity.invitationCode =
      dto.invitationCode ||
      Math.random().toString(36).substring(2, 8).toUpperCase();
    if (dto.qrCodeUrl !== undefined) entity.qrCodeUrl = dto.qrCodeUrl;
    if (dto.rsvpStatus !== undefined) entity.rsvpStatus = dto.rsvpStatus;
    if (dto.attendingCount !== undefined)
      entity.attendingCount = dto.attendingCount;
    if (dto.dietary !== undefined) entity.dietary = dto.dietary;
    if (dto.dietaryNote !== undefined) entity.dietaryNote = dto.dietaryNote;
    if (dto.needsTransport !== undefined)
      entity.needsTransport = dto.needsTransport;
    if (dto.rsvpNote !== undefined) entity.rsvpNote = dto.rsvpNote;
    if (dto.rsvpAt !== undefined) entity.rsvpAt = dto.rsvpAt;
    if (dto.invitedAt !== undefined) entity.invitedAt = dto.invitedAt;
    if (dto.invitationViewedAt !== undefined)
      entity.invitationViewedAt = dto.invitationViewedAt;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateGuestDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    const wedding = await this.weddingRepo.findOne({
      where: { id: entity.weddingId },
    });
    if (!user.isAdmin && (!wedding || wedding.userId !== user.id)) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa khách mời của đám cưới này',
      );
    }

    entity.updatedBy = user.id;

    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.groupId !== undefined) entity.groupId = dto.groupId;
    if (dto.tableId !== undefined) entity.tableId = dto.tableId;
    if (dto.fullName !== undefined) entity.fullName = dto.fullName;
    if (dto.phone !== undefined) entity.phone = dto.phone;
    if (dto.email !== undefined) entity.email = dto.email;
    if (dto.salutation !== undefined) entity.salutation = dto.salutation;
    if (dto.side !== undefined) entity.side = dto.side;
    if (dto.isVip !== undefined) entity.isVip = dto.isVip;
    if (dto.invitationCode !== undefined)
      entity.invitationCode = dto.invitationCode;
    if (dto.qrCodeUrl !== undefined) entity.qrCodeUrl = dto.qrCodeUrl;
    if (dto.rsvpStatus !== undefined) entity.rsvpStatus = dto.rsvpStatus;
    if (dto.attendingCount !== undefined)
      entity.attendingCount = dto.attendingCount;
    if (dto.dietary !== undefined) entity.dietary = dto.dietary;
    if (dto.dietaryNote !== undefined) entity.dietaryNote = dto.dietaryNote;
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
      where: { id: data.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    const wedding = await this.weddingRepo.findOne({
      where: { id: entity.weddingId },
    });
    if (!user.isAdmin && (!wedding || wedding.userId !== user.id)) {
      throw new ForbiddenException('Bạn không có quyền xóa khách mời này');
    }

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xóa thành công' };
  }

  async rsvp(dto: any): Promise<any> {
    const guest = await this.repo.findOne({
      where: { invitationCode: dto.invitationCode, isDeleted: false } as any,
    });
    if (!guest)
      throw new NotFoundException('Không tìm thấy khách mời với mã này');

    if (dto.rsvpStatus !== undefined) guest.rsvpStatus = dto.rsvpStatus;
    if (dto.attendingCount !== undefined)
      guest.attendingCount = dto.attendingCount;
    if (dto.dietary !== undefined) guest.dietary = dto.dietary;
    if (dto.dietaryNote !== undefined) guest.dietaryNote = dto.dietaryNote;
    if (dto.needsTransport !== undefined)
      guest.needsTransport = dto.needsTransport;
    if (dto.rsvpNote !== undefined) guest.rsvpNote = dto.rsvpNote;
    guest.rsvpAt = new Date();

    const saved = await this.repo.save(guest);
    return { message: 'Gửi RSVP thành công', data: saved };
  }

  async identify(code: string): Promise<any> {
    const guest = await this.repo.findOne({
      where: { invitationCode: code, isDeleted: false } as any,
    });
    if (!guest) throw new NotFoundException('Mã mời không chính xác');

    guest.invitationViewedAt = new Date();
    await this.repo.save(guest);

    const wedding = await this.weddingRepo.findOne({
      where: { id: guest.weddingId, isDeleted: false } as any,
    });

    return {
      message: 'Nhận diện khách mời thành công',
      data: {
        guest,
        wedding,
      },
    };
  }

  async generateQrCode(id: string, user: UserDto): Promise<any> {
    const guest = await this.repo.findOne({
      where: { id, isDeleted: false } as any,
    });
    if (!guest) throw new NotFoundException('Không tìm thấy khách mời');

    const wedding = await this.weddingRepo.findOne({
      where: { id: guest.weddingId, isDeleted: false } as any,
    });

    if (!wedding) {
      throw new NotFoundException('Không tìm thấy đám cưới của khách mời này');
    }

    if (!user.isAdmin && wedding.userId !== user.id) {
      throw new ForbiddenException(
        'Bạn không có quyền tạo mã QR cho khách mời này',
      );
    }

    const invitationUrl = `https://wedding.vn/thiep/${wedding.slug}?code=${guest.invitationCode}`;
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
    weddingId: string,
    buffer: Buffer,
    user: UserDto,
  ): Promise<any> {
    const wedding = await this.weddingRepo.findOne({
      where: { id: weddingId, isDeleted: false } as any,
    });
    if (!wedding) throw new NotFoundException('Không tìm thấy đám cưới');

    if (!user.isAdmin && wedding.userId !== user.id) {
      throw new ForbiddenException(
        'Bạn không có quyền thêm khách mời vào đám cưới này',
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

    const guests: GuestEntity[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; 
      const fullName = getCellValueString(row.getCell(1).value);
      if (!fullName) return;

      const phone = getCellValueString(row.getCell(2).value);
      const email = getCellValueString(row.getCell(3).value);
      const salutation = getCellValueString(row.getCell(4).value) || 'Bạn';
      const sideStr = getCellValueString(row.getCell(5).value).toLowerCase();
      const isVipStr = getCellValueString(row.getCell(6).value).toLowerCase();

      const guest = new GuestEntity();
      guest.id = uuidv4();
      guest.weddingId = weddingId;
      guest.fullName = fullName;
      guest.phone = phone;
      guest.email = email;
      guest.salutation = salutation;
      guest.side =
        sideStr === 'groom'
          ? GuestSide.GROOM
          : sideStr === 'bride'
            ? GuestSide.BRIDE
            : GuestSide.BOTH;
      guest.isVip =
        isVipStr === 'true' || isVipStr === '1' || isVipStr === 'yes';
      guest.invitationCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      guest.createdBy = user.id;

      guests.push(guest);
    });

    if (guests.length > 0) {
      await this.repo.save(guests);
    }

    return {
      message: `Import thành công ${guests.length} khách mời`,
      data: guests,
    };
  }
}
