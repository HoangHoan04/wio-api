import { IdDto, PaginationDto, UserDto } from '@/dto';
import { TableEntity } from '@/entities';
import {
  GuestRepository,
  TableRepository,
  WeddingRepository,
} from '@/repositories';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateTableDto, FilterTableDto, UpdateTableDto } from './dto';

@Injectable()
export class TableService {
  constructor(
    private readonly repo: TableRepository,
    private readonly guestRepo: GuestRepository,
    private readonly weddingRepo: WeddingRepository,
  ) {}

  async pagination(data: PaginationDto<FilterTableDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon: FindOptionsWhere<TableEntity> = { isDeleted: false };

    if (where.weddingId !== undefined) whereCon.weddingId = where.weddingId;
    if (where.name !== undefined) whereCon.name = where.name;
    if (where.maxSeats !== undefined) whereCon.maxSeats = where.maxSeats;
    if (where.currentSeats !== undefined)
      whereCon.currentSeats = where.currentSeats;
    if (where.description !== undefined)
      whereCon.description = where.description;
    if (where.positionX !== undefined) whereCon.positionX = where.positionX;
    if (where.positionY !== undefined) whereCon.positionY = where.positionY;

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

  async create(user: UserDto, dto: CreateTableDto) {
    if (dto.weddingId) {
      const wedding = await this.weddingRepo.findOne({
        where: { id: dto.weddingId },
      });
      if (!user.isAdmin && (!wedding || wedding.userId !== user.id)) {
        throw new ForbiddenException(
          'Bạn không có quyền thêm bàn tiệc vào đám cưới này',
        );
      }
    }

    const entity = new TableEntity();
    entity.id = uuidv4();
    entity.createdBy = user.id;

    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.maxSeats !== undefined) entity.maxSeats = dto.maxSeats;
    if (dto.currentSeats !== undefined) entity.currentSeats = dto.currentSeats;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.positionX !== undefined) entity.positionX = dto.positionX;
    if (dto.positionY !== undefined) entity.positionY = dto.positionY;

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thành công', data: saved };
  }

  async update(dto: UpdateTableDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false } as any,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi');

    const wedding = await this.weddingRepo.findOne({
      where: { id: entity.weddingId },
    });
    if (!user.isAdmin && (!wedding || wedding.userId !== user.id)) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa bàn tiệc của đám cưới này',
      );
    }

    entity.updatedBy = user.id;

    if (dto.weddingId !== undefined) entity.weddingId = dto.weddingId;
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.maxSeats !== undefined) entity.maxSeats = dto.maxSeats;
    if (dto.currentSeats !== undefined) entity.currentSeats = dto.currentSeats;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.positionX !== undefined) entity.positionX = dto.positionX;
    if (dto.positionY !== undefined) entity.positionY = dto.positionY;

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
      throw new ForbiddenException('Bạn không có quyền xóa bàn tiệc này');
    }

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xóa thành công' };
  }

  async assignGuest(
    tableId: string,
    guestId: string,
    user: UserDto,
  ): Promise<any> {
    const table = await this.repo.findOne({
      where: { id: tableId, isDeleted: false } as any,
    });
    if (!table) throw new NotFoundException('Không tìm thấy bàn tiệc');

    const wedding = await this.weddingRepo.findOne({
      where: { id: table.weddingId },
    });
    if (!user.isAdmin && (!wedding || wedding.userId !== user.id)) {
      throw new ForbiddenException(
        'Bạn không có quyền xếp chỗ cho bàn tiệc này',
      );
    }

    const guest = await this.guestRepo.findOne({
      where: { id: guestId, isDeleted: false } as any,
    });
    if (!guest) throw new NotFoundException('Không tìm thấy khách mời');

    if (guest.weddingId !== table.weddingId) {
      throw new BadRequestException(
        'Khách mời và bàn tiệc phải thuộc cùng một đám cưới',
      );
    }

    const currentAssignedGuests = await this.guestRepo.find({
      where: { tableId, isDeleted: false },
    });
    const totalAssignedSeats = currentAssignedGuests
      .filter((g) => g.id !== guest.id)
      .reduce((sum, g) => sum + (g.attendingCount || 1), 0);

    const guestAttendingCount = guest.attendingCount || 1;
    if (totalAssignedSeats + guestAttendingCount > table.maxSeats) {
      throw new BadRequestException(
        `Bàn tiệc đã quá tải (chỉ còn ${table.maxSeats - totalAssignedSeats} chỗ trống, khách có ${guestAttendingCount} người)`,
      );
    }

    guest.tableId = tableId;
    await this.guestRepo.save(guest);

    table.currentSeats = totalAssignedSeats + guestAttendingCount;
    await this.repo.save(table);

    return { message: 'Xếp khách vào bàn thành công', data: guest };
  }
}
