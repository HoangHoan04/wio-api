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

  async publicOverview() {}
}
