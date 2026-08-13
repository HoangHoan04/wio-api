import { enumData } from '@/common/constanst/enumData';
import { enumOptions } from '@/utils/enum.utils';
import {
  GuestRepository,
  InvitationRepository,
  TemplateRepository,
  UserRepository,
  WishRepository,
} from '@/repositories';
import { Injectable } from '@nestjs/common';
import { MoreThan } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly invitationRepo: InvitationRepository,
    private readonly guestRepo: GuestRepository,
    private readonly wishRepo: WishRepository,
    private readonly userRepo: UserRepository,
    private readonly templateRepo: TemplateRepository,
  ) {}

  async overview() {
    const since = new Date();
    since.setDate(since.getDate() - 7);

    const [
      totalInvitations,
      published,
      draft,
      archived,
      totalGuests,
      attending,
      pendingWishes,
      newUsers,
    ] = await Promise.all([
      this.invitationRepo.count({ where: { isDeleted: false } }),
      this.invitationRepo.count({
        where: {
          isDeleted: false,
          status: enumData.INVITATION_STATUS.PUBLISHED.code,
        },
      }),
      this.invitationRepo.count({
        where: {
          isDeleted: false,
          status: enumData.INVITATION_STATUS.DRAFT.code,
        },
      }),
      this.invitationRepo.count({
        where: {
          isDeleted: false,
          status: enumData.INVITATION_STATUS.ARCHIVED.code,
        },
      }),
      this.guestRepo.count({ where: { isDeleted: false } }),
      this.guestRepo.count({
        where: {
          isDeleted: false,
          rsvpStatus: enumData.RSVP_STATUS.ATTENDING.code,
        },
      }),
      this.wishRepo.count({
        where: { isDeleted: false, isApproved: false },
      }),
      this.userRepo.count({
        where: { isDeleted: false, createdAt: MoreThan(since) },
      }),
    ]);

    const byType = await Promise.all(
      enumOptions(enumData.CARD_TYPE).map(async (item) => ({
        cardType: item.code,
        name: item.name,
        total: await this.invitationRepo.count({
          where: { isDeleted: false, cardType: item.code },
        }),
      })),
    );

    return {
      message: 'Thành công',
      data: {
        invitations: {
          total: totalInvitations,
          published,
          draft,
          archived,
          byType,
        },
        guests: {
          total: totalGuests,
          attending,
        },
        wishes: { pending: pendingWishes },
        users: { newLast7Days: newUsers },
      },
    };
  }

  async publicOverview() {
    const [publishedInvitations, templates, guests] = await Promise.all([
      this.invitationRepo.count({
        where: {
          isDeleted: false,
          status: enumData.INVITATION_STATUS.PUBLISHED.code,
        },
      }),
      this.templateRepo.count({
        where: { isDeleted: false, isShow: true },
      }),
      this.guestRepo.count({ where: { isDeleted: false } }),
    ]);

    return {
      message: 'Thành công',
      data: {
        publishedInvitations,
        templates,
        guests,
      },
    };
  }
}
