import {
  AiScanJobEntity,
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
  InvitationVersionEntity,
  MusicBackgroundEntity,
  NotificationEntity,
  PhotoWallEntity,
  PromotionEntity,
  ReviewEntity,
  ServicePlanEntity,
  SlugHistoryEntity,
  StockAssetEntity,
  SubscriptionEntity,
  TableEntity,
  TemplateCategoryEntity,
  TemplateEntity,
  TransactionEntity,
  UserEntity,
  UserTokenEntity,
  VerifyOtpEntity,
  WeddingInfoEntity,
  WishEntity,
} from '@/entities';
import { CustomRepository } from '@/typeorm';
import { Repository } from 'typeorm';

/* ============================================================
 * 1. USER & AUTH
 * ============================================================ */
@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}

@CustomRepository(CustomerEntity)
export class CustomerRepository extends Repository<CustomerEntity> {}

@CustomRepository(UserTokenEntity)
export class UserTokenRepository extends Repository<UserTokenEntity> {}

@CustomRepository(VerifyOtpEntity)
export class VerifyOtpRepository extends Repository<VerifyOtpEntity> {}

/* ============================================================
 * 2. INVITATION (Thiệp cưới)
 * ============================================================ */
@CustomRepository(InvitationEntity)
export class InvitationRepository extends Repository<InvitationEntity> {}

@CustomRepository(WeddingInfoEntity)
export class WeddingInfoRepository extends Repository<WeddingInfoEntity> {}

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

@CustomRepository(InvitationVersionEntity)
export class InvitationVersionRepository extends Repository<InvitationVersionEntity> {}

@CustomRepository(SlugHistoryEntity)
export class SlugHistoryRepository extends Repository<SlugHistoryEntity> {}

/* ============================================================
 * 3. AI SCAN
 * ============================================================ */
@CustomRepository(AiScanJobEntity)
export class AiScanJobRepository extends Repository<AiScanJobEntity> {}

/* ============================================================
 * 4. TEMPLATE & STOCK ASSET
 * ============================================================ */
@CustomRepository(TemplateEntity)
export class TemplateRepository extends Repository<TemplateEntity> {}

@CustomRepository(TemplateCategoryEntity)
export class TemplateCategoryRepository extends Repository<TemplateCategoryEntity> {}

@CustomRepository(StockAssetEntity)
export class StockAssetRepository extends Repository<StockAssetEntity> {}

/* ============================================================
 * 5. GUEST & RSVP & SEATING
 * ============================================================ */
@CustomRepository(GuestGroupEntity)
export class GuestGroupRepository extends Repository<GuestGroupEntity> {}

@CustomRepository(GuestEntity)
export class GuestRepository extends Repository<GuestEntity> {}

@CustomRepository(TableEntity)
export class TableRepository extends Repository<TableEntity> {}

/* ============================================================
 * 6. TƯƠNG TÁC KHÁCH MỜI (Wish, PhotoWall)
 * ============================================================ */
@CustomRepository(WishEntity)
export class WishRepository extends Repository<WishEntity> {}

@CustomRepository(PhotoWallEntity)
export class PhotoWallRepository extends Repository<PhotoWallEntity> {}

/* ============================================================
 * 7. THÔNG BÁO
 * ============================================================ */
@CustomRepository(NotificationEntity)
export class NotificationRepository extends Repository<NotificationEntity> {}

/* ============================================================
 * 8. NHẠC NỀN
 * ============================================================ */
@CustomRepository(MusicBackgroundEntity)
export class MusicBackgroundRepository extends Repository<MusicBackgroundEntity> {}

/* ============================================================
 * 9. THANH TOÁN & GÓI DỊCH VỤ
 * ============================================================ */
@CustomRepository(ServicePlanEntity)
export class ServicePlanRepository extends Repository<ServicePlanEntity> {}

@CustomRepository(SubscriptionEntity)
export class SubscriptionRepository extends Repository<SubscriptionEntity> {}

@CustomRepository(TransactionEntity)
export class TransactionRepository extends Repository<TransactionEntity> {}

@CustomRepository(PromotionEntity)
export class PromotionRepository extends Repository<PromotionEntity> {}

/* ============================================================
 * 10. LIÊN HỆ & ĐÁNH GIÁ
 * ============================================================ */
@CustomRepository(ContactEntity)
export class ContactRepository extends Repository<ContactEntity> {}

@CustomRepository(ReviewEntity)
export class ReviewRepository extends Repository<ReviewEntity> {}
