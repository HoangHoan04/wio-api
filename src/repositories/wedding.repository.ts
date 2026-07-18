import {
  CustomerEntity,
  GuestEntity,
  GuestGroupEntity,
  MusicBackgroundEntity,
  NotificationEntity,
  PhotoWallEntity,
  ServicePlanEntity,
  SlugHistoryEntity,
  SubscriptionEntity,
  TableEntity,
  TemplateEntity,
  UserEntity,
  UserTokenEntity,
  VerifyOtpEntity,
  WeddingEntity,
  WeddingPhotoEntity,
  WishEntity,
} from '@/entities';
import { CustomRepository } from '@/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}

@CustomRepository(TemplateEntity)
export class TemplateRepository extends Repository<TemplateEntity> {}

@CustomRepository(WeddingEntity)
export class WeddingRepository extends Repository<WeddingEntity> {}

@CustomRepository(WeddingPhotoEntity)
export class WeddingPhotoRepository extends Repository<WeddingPhotoEntity> {}

@CustomRepository(GuestGroupEntity)
export class GuestGroupRepository extends Repository<GuestGroupEntity> {}

@CustomRepository(GuestEntity)
export class GuestRepository extends Repository<GuestEntity> {}

@CustomRepository(TableEntity)
export class TableRepository extends Repository<TableEntity> {}

@CustomRepository(WishEntity)
export class WishRepository extends Repository<WishEntity> {}

@CustomRepository(PhotoWallEntity)
export class PhotoWallRepository extends Repository<PhotoWallEntity> {}

@CustomRepository(NotificationEntity)
export class NotificationRepository extends Repository<NotificationEntity> {}

@CustomRepository(ServicePlanEntity)
export class ServicePlanRepository extends Repository<ServicePlanEntity> {}

@CustomRepository(SubscriptionEntity)
export class SubscriptionRepository extends Repository<SubscriptionEntity> {}

@CustomRepository(CustomerEntity)
export class CustomerRepository extends Repository<CustomerEntity> {}

@CustomRepository(UserTokenEntity)
export class UserTokenRepository extends Repository<UserTokenEntity> {}

@CustomRepository(VerifyOtpEntity)
export class VerifyOtpRepository extends Repository<VerifyOtpEntity> {}

@CustomRepository(SlugHistoryEntity)
export class SlugHistoryRepository extends Repository<SlugHistoryEntity> {}

@CustomRepository(MusicBackgroundEntity)
export class MusicBackgroundRepository extends Repository<MusicBackgroundEntity> {}
