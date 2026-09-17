import { enumData } from '@/common/constanst/enumData';
import { IdDto, PaginationDto, UserDto } from '@/dto';
import { NotificationEntity } from '@/entities';
import {
  GuestRepository,
  InvitationRepository,
  NotificationRepository,
} from '@/repositories';
import { isAdminUser } from '@/utils/owner.utils';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Between,
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  BroadcastNotificationDto,
  CreateNotificationDto,
  FilterNotificationDto,
  UpdateNotificationDto,
} from './dto';
@Injectable()
export class NotificationService {
  constructor(
    private readonly repo: NotificationRepository,
    private readonly invitationRepo: InvitationRepository,
    private readonly guestRepo: GuestRepository,
  ) {}

  /* ============================================================
   * HELPER: Assert ownership
   * ============================================================ */
  private async assertInvitationOwnership(
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
   * HELPER: Build where từ filter
   * ============================================================ */
  private buildWhere(
    filter: FilterNotificationDto,
  ): FindOptionsWhere<NotificationEntity> {
    const where: FindOptionsWhere<NotificationEntity> = { isDeleted: false };

    if (filter.invitationId) where.invitationId = filter.invitationId;
    if (filter.guestId) where.guestId = filter.guestId;
    if (filter.channel) where.channel = filter.channel;
    if (filter.type) where.type = filter.type;
    if (filter.status) where.status = filter.status;

    // Khoảng thời gian lên lịch
    if (filter.scheduledFrom && filter.scheduledTo) {
      where.scheduledAt = Between(filter.scheduledFrom, filter.scheduledTo);
    } else if (filter.scheduledFrom) {
      where.scheduledAt = MoreThanOrEqual(filter.scheduledFrom);
    } else if (filter.scheduledTo) {
      where.scheduledAt = LessThanOrEqual(filter.scheduledTo);
    }

    // Khoảng thời gian đã gửi
    if (filter.sentFrom && filter.sentTo) {
      where.sentAt = Between(filter.sentFrom, filter.sentTo);
    } else if (filter.sentFrom) {
      where.sentAt = MoreThanOrEqual(filter.sentFrom);
    } else if (filter.sentTo) {
      where.sentAt = LessThanOrEqual(filter.sentTo);
    }

    return where;
  }

  /* ============================================================
   * PAGINATION — User (chỉ thông báo thuộc thiệp của mình)
   * ============================================================ */
  async paginationForUser(
    data: PaginationDto<FilterNotificationDto>,
    user: UserDto,
  ) {
    const { skip = 0, take = 10, where = {} } = data;

    // Nếu filter theo 1 thiệp → check quyền sở hữu
    if (where.invitationId) {
      await this.assertInvitationOwnership(
        where.invitationId,
        user,
        'xem thông báo của thiệp này',
      );
    } else {
      // Không filter thiệp → chỉ lấy thông báo của các thiệp user sở hữu
      const invitations = await this.invitationRepo.find({
        where: { userId: user.id, isDeleted: false },
        select: { id: true },
      });

      if (!invitations.length) {
        return { data: [], total: 0 };
      }

      const whereCon = this.buildWhere(where);
      whereCon.invitationId = In(invitations.map((i) => i.id));

      const [list, total] = await this.repo.findAndCount({
        where: whereCon,
        skip,
        take,
        order: { createdAt: 'DESC' },
      });
      return { data: list, total };
    }

    const whereCon = this.buildWhere(where);
    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
    return { data: list, total };
  }

  /* ============================================================
   * PAGINATION — Admin (toàn hệ thống)
   * ============================================================ */
  async pagination(data: PaginationDto<FilterNotificationDto>) {
    const { skip = 0, take = 10, where = {} } = data;
    const whereCon = this.buildWhere(where);

    const [list, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: { invitation: false, guest: false },
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
      relations: { invitation: true, guest: true },
    });
    if (!item) throw new NotFoundException('Không tìm thấy thông báo');

    if (user && !isAdminUser(user)) {
      await this.assertInvitationOwnership(
        item.invitationId,
        user,
        'xem thông báo này',
      );
    }

    return { message: 'Thành công', data: item };
  }

  /* ============================================================
   * CREATE
   * ============================================================ */
  async create(user: UserDto, dto: CreateNotificationDto) {
    await this.assertInvitationOwnership(
      dto.invitationId,
      user,
      'tạo thông báo cho thiệp này',
    );

    const entity = this.repo.create({
      id: uuidv4(),
      invitationId: dto.invitationId,
      guestId: dto.guestId,
      channel: dto.channel,
      type: dto.type,
      subject: dto.subject,
      content: dto.content,
      status: dto.status || enumData.NOTIF_STATUS.PENDING.code,
      scheduledAt: dto.scheduledAt,
      sentAt: dto.sentAt,
      failedReason: dto.failedReason,
      provider: dto.provider,
      providerMsgId: dto.providerMsgId,
      createdBy: user.id,
    });

    const saved = await this.repo.save(entity);
    return { message: 'Tạo thông báo thành công', data: saved };
  }

  /* ============================================================
   * UPDATE
   * ============================================================ */
  async update(dto: UpdateNotificationDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thông báo');

    await this.assertInvitationOwnership(
      entity.invitationId,
      user,
      'chỉnh sửa thông báo này',
    );

    if (dto.channel !== undefined) entity.channel = dto.channel;
    if (dto.type !== undefined) entity.type = dto.type;
    if (dto.subject !== undefined) entity.subject = dto.subject;
    if (dto.content !== undefined) entity.content = dto.content;
    if (dto.status !== undefined) entity.status = dto.status;
    if (dto.scheduledAt !== undefined) entity.scheduledAt = dto.scheduledAt;
    if (dto.sentAt !== undefined) entity.sentAt = dto.sentAt;
    if (dto.failedReason !== undefined) entity.failedReason = dto.failedReason;
    if (dto.provider !== undefined) entity.provider = dto.provider;
    if (dto.providerMsgId !== undefined) {
      entity.providerMsgId = dto.providerMsgId;
    }

    entity.updatedBy = user.id;
    const saved = await this.repo.save(entity);
    return { message: 'Cập nhật thông báo thành công', data: saved };
  }

  /* ============================================================
   * DELETE (soft)
   * ============================================================ */
  async delete(data: IdDto, user: UserDto) {
    const entity = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thông báo');

    await this.assertInvitationOwnership(
      entity.invitationId,
      user,
      'xoá thông báo này',
    );

    entity.isDeleted = true;
    entity.updatedBy = user.id;
    await this.repo.save(entity);
    return { message: 'Xoá thông báo thành công' };
  }

  /* ============================================================
   * BROADCAST — tạo thông báo cho toàn bộ khách mời của thiệp
   * ============================================================ */
  async broadcast(user: UserDto, dto: BroadcastNotificationDto) {
    await this.assertInvitationOwnership(
      dto.invitationId,
      user,
      'gửi thông báo cho thiệp này',
    );

    // Lấy toàn bộ guest chưa xoá
    const guests = await this.guestRepo.find({
      where: { invitationId: dto.invitationId, isDeleted: false },
      select: { id: true },
    });

    if (!guests.length) {
      return {
        message: 'Không có khách mời nào để gửi thông báo',
        data: { created: 0 },
      };
    }

    const entities = guests.map((guest) =>
      this.repo.create({
        id: uuidv4(),
        invitationId: dto.invitationId,
        guestId: guest.id,
        channel: dto.channel,
        type: dto.type,
        subject: dto.subject,
        content: dto.content,
        status: enumData.NOTIF_STATUS.PENDING.code,
        scheduledAt: dto.scheduledAt,
        createdBy: user.id,
      }),
    );

    await this.repo.save(entities);

    return {
      message: `Đã tạo ${entities.length} thông báo cho khách mời`,
      data: { created: entities.length },
    };
  }

  /* ============================================================
   * MARK AS SENT — dùng cho worker gửi thông báo
   * ============================================================ */
  async markAsSent(id: string, providerMsgId?: string, provider?: string) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thông báo');

    entity.status = enumData.NOTIF_STATUS.SENT.code;
    entity.sentAt = new Date();
    if (providerMsgId) entity.providerMsgId = providerMsgId;
    if (provider) entity.provider = provider;

    await this.repo.save(entity);
    return { message: 'Đã đánh dấu là đã gửi' };
  }

  /* ============================================================
   * MARK AS FAILED — dùng cho worker
   * ============================================================ */
  async markAsFailed(id: string, failedReason: string) {
    const entity = await this.repo.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) throw new NotFoundException('Không tìm thấy thông báo');

    entity.status = enumData.NOTIF_STATUS.FAILED.code;
    entity.failedReason = failedReason;

    await this.repo.save(entity);
    return { message: 'Đã đánh dấu là gửi thất bại' };
  }

  /* ============================================================
   * FIND PENDING — worker poll để gửi
   * ============================================================ */
  async findPendingDue(limit = 100) {
    return this.repo.find({
      where: {
        isDeleted: false,
        status: enumData.NOTIF_STATUS.PENDING.code,
        scheduledAt: LessThanOrEqual(new Date()),
      },
      order: { scheduledAt: 'ASC' },
      take: limit,
    });
  }
}
