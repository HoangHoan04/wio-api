import {
  RsvpStatus,
  SubStatus,
  UserRole,
  WeddingStatus,
} from '@/entities/enums';
import {
  GuestRepository,
  SubscriptionRepository,
  UserRepository,
  WeddingRepository,
} from '@/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly weddingRepo: WeddingRepository,
    private readonly guestRepo: GuestRepository,
    private readonly subRepo: SubscriptionRepository,
  ) {}

  async getSystemStats() {
    // 1. User stats
    const [totalUsers, activeUsers, suspendedUsers, coupleUsers, adminUsers] =
      await Promise.all([
        this.userRepo.count({ where: { isDeleted: false } }),
        this.userRepo.count({ where: { isActive: true, isDeleted: false } }),
        this.userRepo.count({ where: { isActive: false, isDeleted: false } }),
        this.userRepo.count({
          where: { role: UserRole.COUPLE, isDeleted: false },
        }),
        this.userRepo.count({
          where: { role: UserRole.ADMIN, isDeleted: false },
        }),
      ]);

    // 2. Wedding stats
    const [totalWeddings, draftWeddings, publishedWeddings, archivedWeddings] =
      await Promise.all([
        this.weddingRepo.count({ where: { isDeleted: false } }),
        this.weddingRepo.count({
          where: { status: WeddingStatus.DRAFT, isDeleted: false },
        }),
        this.weddingRepo.count({
          where: { status: WeddingStatus.PUBLISHED, isDeleted: false },
        }),
        this.weddingRepo.count({
          where: { status: WeddingStatus.ARCHIVED, isDeleted: false },
        }),
      ]);

    // 3. Guest RSVP stats
    const [totalGuests, pendingGuests, attendingGuests, declinedGuests] =
      await Promise.all([
        this.guestRepo.count({ where: { isDeleted: false } }),
        this.guestRepo.count({
          where: { rsvpStatus: RsvpStatus.PENDING, isDeleted: false },
        }),
        this.guestRepo.count({
          where: { rsvpStatus: RsvpStatus.ATTENDING, isDeleted: false },
        }),
        this.guestRepo.count({
          where: { rsvpStatus: RsvpStatus.DECLINED, isDeleted: false },
        }),
      ]);

    // Attending seats sum
    const attendingList = await this.guestRepo.find({
      where: { rsvpStatus: RsvpStatus.ATTENDING, isDeleted: false },
      select: ['attendingCount'],
    });
    const totalAttendingSeats = attendingList.reduce(
      (sum, g) => sum + (g.attendingCount || 1),
      0,
    );

    // 4. Subscription stats
    const [totalSubs, activeSubs, expiredSubs, cancelledSubs] =
      await Promise.all([
        this.subRepo.count({ where: { isDeleted: false } }),
        this.subRepo.count({
          where: { status: SubStatus.ACTIVE, isDeleted: false },
        }),
        this.subRepo.count({
          where: { status: SubStatus.EXPIRED, isDeleted: false },
        }),
        this.subRepo.count({
          where: { status: SubStatus.CANCELLED, isDeleted: false },
        }),
      ]);

    // 5. Revenue
    const payments = await this.subRepo.find({
      where: { isDeleted: false },
      select: ['paidAmountVnd'],
    });
    const totalRevenue = payments.reduce(
      (sum, p) => sum + Number(p.paidAmountVnd || 0),
      0,
    );

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: suspendedUsers,
        couple: coupleUsers,
        admin: adminUsers,
      },
      weddings: {
        total: totalWeddings,
        draft: draftWeddings,
        published: publishedWeddings,
        archived: archivedWeddings,
      },
      rsvp: {
        totalGuests,
        pending: pendingGuests,
        attending: attendingGuests,
        declined: declinedGuests,
        totalSeats: totalAttendingSeats,
      },
      subscriptions: {
        total: totalSubs,
        active: activeSubs,
        expired: expiredSubs,
        cancelled: cancelledSubs,
        revenueVnd: totalRevenue,
      },
    };
  }
}
