import { enumData } from '@/common/constanst/enumData';
import {
  GuestRepository,
  InvitationRepository,
  ReviewRepository,
  TemplateRepository,
  UserRepository,
  WishRepository,
} from '@/repositories';
import { Injectable } from '@nestjs/common';

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

  async overview() {}

  async publicOverview() {
    const [publishedInvitations, templates, reviews] = await Promise.all([
      this.invitationRepo.count({
        where: {
          isDeleted: false,
          status: enumData.INVITATION_STATUS.PUBLISHED.code,
        },
      }),
      this.templateRepo.count({
        where: { isDeleted: false, isShow: true },
      }),
      this.reviewRepo.count({
        where: {
          isDeleted: false,
          status: enumData.REVIEW_STATUS.APPROVED.code,
        },
      }),
    ]);

    return {
      message: 'Thành công',
      data: { publishedInvitations, templates, reviews },
    };
  }
}
