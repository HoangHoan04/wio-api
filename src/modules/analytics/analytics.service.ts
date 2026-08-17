import { enumData } from '@/common/constanst/enumData';
import { enumOptions } from '@/utils/enum.utils';
import {
  GuestRepository,
  InvitationRepository,
  ReviewRepository,
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
    private readonly reviewRepo: ReviewRepository,
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
    const [publishedInvitations, templates, reviews] = await Promise.all([
      this.invitationRepo.count({
        where: {
          isDeleted: false,
          status: enumData.INVITATION_STATUS.PUBLISHED.code,
        },
      }),
      this.templateRepo
        .createQueryBuilder('tpl')
        .where('tpl.isDeleted = :isDeleted', { isDeleted: false })
        .andWhere('tpl.isShow = :isShow', { isShow: true })
        .andWhere('tpl.themeCode != :customDesign', {
          customDesign: enumData.THEME_CODE.CUSTOM_DESIGN.code,
        })
        .getCount(),
      this.reviewRepo.count({
        where: {
          isDeleted: false,
          status: enumData.REVIEW_STATUS.APPROVED.code,
        },
      }),
    ]);

    return {
      message: 'Thành công',
      data: {
        publishedInvitations,
        templates,
        reviews,
      },
    };
  }
}
