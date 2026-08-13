import { enumData } from '@/common/constanst/enumData';
import { SubscriptionEntity } from '@/entities';
import { EntityManager } from 'typeorm';

export type PlanLimits = {
  maxInvitations: number;
  maxGuests: number;
  maxPhotos: number;
};

export async function getActivePlanLimits(
  manager: EntityManager,
  userId: string,
): Promise<PlanLimits> {
  const sub = await manager.findOne(SubscriptionEntity, {
    where: {
      userId,
      status: enumData.SUB_STATUS.ACTIVE.code,
      isDeleted: false,
    },
    relations: ['plan'],
    order: { createdAt: 'DESC' },
  });
  return {
    maxInvitations: sub?.plan?.maxInvitations ?? 1,
    maxGuests: sub?.plan?.maxGuests ?? 30,
    maxPhotos: sub?.plan?.maxPhotos ?? 10,
  };
}
