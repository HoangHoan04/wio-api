import { ChildModule } from '@/common/decorators';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AnalyticsPublicController } from '../analytics/controllers/analytics-public.controller';
import { AnalyticsModule } from '../analytics/analytics.module';
import { AuthModule } from '../auth/auth.module';
import { AuthUserController } from '../auth/controller/auth-user.controller';
import { CardTypeModule } from '../card-type/card-type.module';
import { CardTypePublicController } from '../card-type/controllers/card-type-public.controller';
import { PREFIX_MODULE } from '../config-module';
import { ContactModule } from '../contact/contact.module';
import { ContactPublicController } from '../contact/controllers/contact-public.controller';
import { GuestPublicController } from '../guest/controllers/guest-public.controller';
import { GuestUserController } from '../guest/controllers/guest-user.controller';
import { GuestModule } from '../guest/guest.module';
import { InvitationPublicController } from '../invitation/controllers/invitation-public.controller';
import { InvitationUserController } from '../invitation/controllers/invitation-user.controller';
import { InvitationModule } from '../invitation/invitation.module';
import { MusicBackgroundUserController } from '../music-background/controllers/music-background-user.controller';
import { MusicBackgroundModule } from '../music-background/music-background.module';
import { NotificationUserController } from '../notification/controllers/notification-user.controller';
import { NotificationModule } from '../notification/notification.module';
import { PhotoWallUserController } from '../photo-wall/controllers/photo-wall-user.controller';
import { PhotoWallPublicController } from '../photo-wall/controllers/photo-wall-public.controller';
import { PhotoWallModule } from '../photo-wall/photo-wall.module';
import { ReviewPublicController } from '../review/controllers/review-public.controller';
import { ReviewModule } from '../review/review.module';
import { StockAssetPublicController } from '../stock-asset/controllers/stock-asset-public.controller';
import { StockAssetModule } from '../stock-asset/stock-asset.module';
import { ServicePlanPublicController } from '../service-plan/controllers/service-plan-public.controller';
import { ServicePlanUserController } from '../service-plan/controllers/service-plan-user.controller';
import { ServicePlanModule } from '../service-plan/service-plan.module';
import { SubscriptionUserController } from '../subscription/controllers/subscription-user.controller';
import { SubscriptionModule } from '../subscription/subscription.module';
import { TableUserController } from '../table/controllers/table-user.controller';
import { TableModule } from '../table/table.module';
import { TemplateUserController } from '../template/controllers/template-user.controller';
import { TemplateModule } from '../template/template.module';
import { WishUserController } from '../wish/controllers/wish-user.controller';
import { WishPublicController } from '../wish/controllers/wish-public.controller';
import { WishModule } from '../wish/wish.module';

@ChildModule({
  prefix: PREFIX_MODULE.user,
  controllers: [
    AuthUserController,
    AnalyticsPublicController,
    TemplateUserController,
    InvitationUserController,
    InvitationPublicController,
    CardTypePublicController,
    GuestUserController,
    GuestPublicController,
    TableUserController,
    WishUserController,
    WishPublicController,
    PhotoWallUserController,
    PhotoWallPublicController,
    NotificationUserController,
    ServicePlanUserController,
    ServicePlanPublicController,
    SubscriptionUserController,
    MusicBackgroundUserController,
    ContactPublicController,
    ReviewPublicController,
    StockAssetPublicController,
  ],
  imports: [
    AuthModule,
    AnalyticsModule,
    TemplateModule,
    InvitationModule,
    CardTypeModule,
    GuestModule,
    TableModule,
    WishModule,
    PhotoWallModule,
    NotificationModule,
    ServicePlanModule,
    SubscriptionModule,
    MusicBackgroundModule,
    ContactModule,
    ReviewModule,
    StockAssetModule,
  ],
  exports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
