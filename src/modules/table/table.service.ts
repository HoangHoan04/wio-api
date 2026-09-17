import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { TableEntity } from '@/entities';
import {
  GuestRepository,
  InvitationRepository,
  TableRepository,
} from '@/repositories';
import { assertInvitationModule } from '@/utils/invitation.utils';
import { isAdminUser } from '@/utils/owner.utils';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  AssignGuestDto,
  CreateTableDto,
  FilterTableDto,
  UpdateTableDto,
} from './dto';

@Injectable()
export class TableService {
  constructor(
    private readonly repo: TableRepository,
    private readonly guestRepo: GuestRepository,
    private readonly invitationRepo: InvitationRepository,
  ) {}

  /* ============================================================
   * HELPER — Assert quyền sở hữu + module SEATING
   * ============================================================ */
  private async assertSeatingAccess(invitationId: string, user: UserDto) {
    const invitation = await this.invitationRepo.findOne({
      where: { id: invitationId, isDeleted: false },
    });
    if (!invitation) throw new NotFoundException('Không tìm thấy thiệp');

    if (!isAdminUser(user) && invitation.userId !== user.id) {
      throw new ForbiddenException(
        'Bạn không có quyền thao tác sơ đồ bàn của thiệp này',
      );
    }

    // ✅ Dùng helper mới — đọc sectionConfig thay vì enabledModules
    assertInvitationModule(
      invitation,
      enumData.INVITATION_MODULE.SEATING.code,
      'Thiệp này không bật sơ đồ bàn',
    );

    return invitation;
  }

  /* ============================================================
   * HELPER — Tính lại currentSeats của 1 bàn
   * ============================================================ */
  private async recalcTableSeats(tableId: string) {
    const guests = await this.guestRepo.find({
      where: { tableId, isDeleted: false },
    });
    const totalSeats = guests.reduce(
      (sum, g) => sum + (g.attendingCount || 1),
      0,
    );

    await this.repo.update({ id: tableId }, { currentSeats: totalSeats });
    return totalSeats;
  }

  /* ============================================================
   * PAGINATION
   * ============================================================ */
  async pagination(data: PaginationDto<FilterTableDto>, user?: UserDto) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<TableEntity> = { isDeleted: false };

    if (where.invitationId) whereCon.invitationId = where.invitationId;
    if (where.name) whereCon.name = ILike(`%${where.name}%`);

    // Nếu là user thường → chỉ lấy bàn thuộc thiệp của họ
    if (user && !isAdminUser(user)) {
      if (where.invitationId) {
        await this.assertSeatingAccess(where.invitationId, user);
      } else {
        const invitations = await this.invitationRepo.find({
          where: { userId: user.id, isDeleted: false },
          select: { id: true },
        });
        if (!invitations.length) return { data: [], total: 0 };
        whereCon.invitationId = In(invitations.map((i) => i.id));
      }
    }

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: { guests: true },
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
      relations: { guests: true, invitation: true },
    });
    if (!item) throw new NotFoundException('Không tìm thấy bàn tiệc');

    if (user && !isAdminUser(user)) {
      await this.assertSeatingAccess(item.invitationId, user);
    }

    return { message: 'Thành công', data: item };
  }

  /* ============================================================
   * CREATE
   * ============================================================ */
  async create(user: UserDto, dto: CreateTableDto) {
    await this.assertSeatingAccess(dto.invitationId, user);

    const entity = this.repo.create({
      id: uuidv4(),
      invitationId: dto.invitationId,
      name: dto.name,
      maxSeats: dto.maxSeats,
      currentSeats: 0,
      description: dto.description,
      positionX: dto.positionX,
      positionY: dto.positionY,
      createdBy: user.id,
    });

    const saved = await this.repo.save(entity);
    return { message: 'Tạo bàn tiệc thành công', data: saved };
  }

  /* ============================================================
   * UPDATE
   * ============================================================ */
  async update(dto: UpdateTableDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bàn tiệc');

    await this.assertSeatingAccess(entity.invitationId, user);

    // Nếu giảm maxSeats → phải đảm bảo không nhỏ hơn số ghế hiện tại
    if (dto.maxSeats !== undefined && dto.maxSeats < entity.currentSeats) {
      throw new BadRequestException(
        `Không thể giảm số ghế xuống ${dto.maxSeats} vì đang có ${entity.currentSeats} khách`,
      );
    }

    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.maxSeats !== undefined) entity.maxSeats = dto.maxSeats;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.positionX !== undefined) entity.positionX = dto.positionX;
    if (dto.positionY !== undefined) entity.positionY = dto.positionY;

    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật bàn tiệc thành công', data: saved };
  }

  /* ============================================================
   * DELETE (soft)
   * ============================================================ */
  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bàn tiệc');

    await this.assertSeatingAccess(entity.invitationId, user);

    // Gỡ toàn bộ guest khỏi bàn trước khi xoá
    await this.guestRepo.update(
      { tableId: entity.id, isDeleted: false },
      { tableId: null as any },
    );

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xoá bàn tiệc thành công' };
  }

  /* ============================================================
   * ASSIGN GUEST — dùng transaction để tránh race condition
   * ============================================================ */
  async assignGuest(dto: AssignGuestDto, user: UserDto) {
    return this.repo.manager.transaction(async (manager) => {
      const tableRepo = manager.getRepository(TableEntity);

      const table = await tableRepo.findOne({
        where: { id: dto.tableId, isDeleted: false },
      });
      if (!table) throw new NotFoundException('Không tìm thấy bàn tiệc');

      await this.assertSeatingAccess(table.invitationId, user);

      const guest = await this.guestRepo.findOne({
        where: { id: dto.guestId, isDeleted: false },
      });
      if (!guest) throw new NotFoundException('Không tìm thấy khách mời');

      if (guest.invitationId !== table.invitationId) {
        throw new BadRequestException(
          'Khách mời và bàn tiệc phải thuộc cùng một thiệp',
        );
      }

      // Nếu khách đã ở bàn này rồi → không làm gì
      if (guest.tableId === table.id) {
        return { message: 'Khách đã ở trong bàn này', data: guest };
      }

      const oldTableId = guest.tableId;

      // Đếm lại số ghế hiện tại của bàn (không tính guest đang xét)
      const currentGuests = await this.guestRepo.find({
        where: { tableId: table.id, isDeleted: false },
      });
      const occupiedSeats = currentGuests
        .filter((g) => g.id !== guest.id)
        .reduce((sum, g) => sum + (g.attendingCount || 1), 0);

      const guestSeats = guest.attendingCount || 1;
      if (occupiedSeats + guestSeats > table.maxSeats) {
        const remaining = table.maxSeats - occupiedSeats;
        throw new BadRequestException(
          `Bàn đã quá tải (còn ${remaining} chỗ, khách cần ${guestSeats} chỗ)`,
        );
      }

      // Cập nhật guest vào bàn mới
      guest.tableId = table.id;
      guest.updatedBy = user.id;
      await this.guestRepo.save(guest);

      // Tính lại currentSeats cho bàn mới và bàn cũ
      await this.recalcTableSeats(table.id);
      if (oldTableId && oldTableId !== table.id) {
        await this.recalcTableSeats(oldTableId);
      }

      return { message: 'Xếp khách vào bàn thành công', data: guest };
    });
  }

  /* ============================================================
   * UNASSIGN GUEST
   * ============================================================ */
  async unassignGuest(guestId: string, user: UserDto) {
    return this.repo.manager.transaction(async (manager) => {
      const guest = await this.guestRepo.findOne({
        where: { id: guestId, isDeleted: false },
      });
      if (!guest) throw new NotFoundException('Không tìm thấy khách mời');

      await this.assertSeatingAccess(guest.invitationId, user);

      if (!guest.tableId) {
        return { message: 'Khách chưa được xếp vào bàn nào', data: guest };
      }

      const oldTableId = guest.tableId;
      guest.tableId = null as any;
      guest.updatedBy = user.id;
      await this.guestRepo.save(guest);

      await this.recalcTableSeats(oldTableId);

      return { message: 'Gỡ khách khỏi bàn thành công', data: guest };
    });
  }

  /* ============================================================
   * PUBLIC — Danh sách bàn + khách cho thiệp công khai
   * ============================================================ */
  async listByInvitation(invitationId: string) {
    const tables = await this.repo.find({
      where: { invitationId, isDeleted: false },
      relations: { guests: true },
      order: { name: 'ASC' },
    });

    return {
      message: 'Thành công',
      data: tables.map((table) => ({
        id: table.id,
        name: table.name,
        maxSeats: table.maxSeats,
        currentSeats: table.currentSeats,
        positionX: table.positionX,
        positionY: table.positionY,
        guests:
          table.guests?.map((g) => ({
            id: g.id,
            fullName: g.fullName,
            salutation: g.salutation,
            attendingCount: g.attendingCount,
            rsvpStatus: g.rsvpStatus,
            isVip: g.isVip,
          })) || [],
      })),
    };
  }
}
