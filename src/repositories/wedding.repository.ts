import {
  CardTypeEntity,
  ContactEntity,
  CustomerEntity,
  GuestEntity,
  GuestGroupEntity,
  InvitationEntity,
  InvitationEventEntity,
  InvitationGiftEntity,
  InvitationHostEntity,
  InvitationPhotoEntity,
  InvitationTimelineEntity,
  MusicBackgroundEntity,
  NotificationEntity,
  PhotoWallEntity,
  PromotionEntity,
  ReviewEntity,
  StockAssetEntity,
  ServicePlanEntity,
  SlugHistoryEntity,
  SubscriptionEntity,
  TableEntity,
  TemplateCardTypeEntity,
  TemplateEntity,
  TransactionEntity,
  UserEntity,
  UserTokenEntity,
  VerifyOtpEntity,
  WishEntity,
} from '@/entities';
import { CustomRepository } from '@/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}

@CustomRepository(TemplateEntity)
export class TemplateRepository extends Repository<TemplateEntity> {}

@CustomRepository(InvitationEntity)
export class InvitationRepository extends Repository<InvitationEntity> {}

@CustomRepository(InvitationHostEntity)
export class InvitationHostRepository extends Repository<InvitationHostEntity> {}

@CustomRepository(InvitationEventEntity)
export class InvitationEventRepository extends Repository<InvitationEventEntity> {}

@CustomRepository(InvitationPhotoEntity)
export class InvitationPhotoRepository extends Repository<InvitationPhotoEntity> {}

@CustomRepository(InvitationGiftEntity)
export class InvitationGiftRepository extends Repository<InvitationGiftEntity> {}

@CustomRepository(InvitationTimelineEntity)
export class InvitationTimelineRepository extends Repository<InvitationTimelineEntity> {}

@CustomRepository(GuestGroupEntity)
export class GuestGroupRepository extends Repository<GuestGroupEntity> {}

@CustomRepository(CardTypeEntity)
export class CardTypeRepository extends Repository<CardTypeEntity> {}

@CustomRepository(TemplateCardTypeEntity)
export class TemplateCardTypeRepository extends Repository<TemplateCardTypeEntity> {}

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

@CustomRepository(TransactionEntity)
export class TransactionRepository extends Repository<TransactionEntity> {}

@CustomRepository(PromotionEntity)
export class PromotionRepository extends Repository<PromotionEntity> {}

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

@CustomRepository(ContactEntity)
export class ContactRepository extends Repository<ContactEntity> {}

@CustomRepository(ReviewEntity)
export class ReviewRepository extends Repository<ReviewEntity> {}

@CustomRepository(StockAssetEntity)
export class StockAssetRepository extends Repository<StockAssetEntity> {}
