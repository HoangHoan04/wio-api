import { ChildModule } from '@/common/decorators';
import { ActionLogController } from '../action-log/action-log.controller';
import { ActionLogModule } from '../action-log/action-log.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { AnalyticsAdminController } from '../analytics/controllers/analytics-admin.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthAdminController } from '../auth/controller/auth-admin.controller';
import { PREFIX_MODULE } from '../config-module';
import { ContactModule } from '../contact/contact.module';
import { ContactAdminController } from '../contact/controllers/contact-admin.controller';
import { CustomerAdminController } from '../customer/controllers/customer-admin.controller';
import { CustomerModule } from '../customer/customer.module';
import { GuestAdminController } from '../guest/controllers/guest-admin.controller';
import { GuestModule } from '../guest/guest.module';
import { InvitationAdminController } from '../invitation/controllers/invitation-admin.controller';
import { InvitationModule } from '../invitation/invitation.module';
import { MusicBackgroundAdminController } from '../music-background/controllers/music-background-admin.controller';
import { MusicBackgroundModule } from '../music-background/music-background.module';
import { PhotoWallAdminController } from '../photo-wall/controllers/photo-wall-admin.controller';
import { PhotoWallModule } from '../photo-wall/photo-wall.module';
import { ReviewAdminController } from '../review/controllers/review-admin.controller';
import { ReviewModule } from '../review/review.module';
import { ServicePlanAdminController } from '../service-plan/controllers/service-plan-admin.controller';
import { ServicePlanModule } from '../service-plan/service-plan.module';
import { StockAssetAdminController } from '../stock-asset/controllers/stock-asset-admin.controller';
import { StockAssetModule } from '../stock-asset/stock-asset.module';
import { SubscriptionAdminController } from '../subscription/controllers/subscription-admin.controller';
import { SubscriptionModule } from '../subscription/subscription.module';
import { TemplateCategoryAdminController } from '../template-cateogry/controllers/template-category-admin.controller';
import { TemplateCategoryModule } from '../template-cateogry/template-category.module';
import { TemplateAdminController } from '../template/controllers/template-admin.controller';
import { TemplateModule } from '../template/template.module';
import { WishAdminController } from '../wish/controllers/wish-admin.controller';
import { WishModule } from '../wish/wish.module';

import { NotificationModule } from '../notification/notification.module';
import { NotificationAdminController } from '../notification/controllers/notification-admin.controller';
import { WeddingInfoModule } from '../wedding-info/wedding-info.module';
import { WeddingInfoAdminController } from '../wedding-info/controllers/wedding-info-admin.controller';

/**
 * AdminModule — Nhóm tất cả controller admin vào 1 prefix /admin.
 *
 * Route ví dụ:
 *   - POST /admin/auth/login
 *   - POST /admin/template/pagination
 *   - POST /admin/invitation/pagination
 */
@ChildModule({
  prefix: PREFIX_MODULE.admin,
  controllers: [
    AuthAdminController,
    CustomerAdminController,
    TemplateAdminController,
    TemplateCategoryAdminController,
    InvitationAdminController,
    WeddingInfoAdminController,
    GuestAdminController,
    WishAdminController,
    PhotoWallAdminController,
    ServicePlanAdminController,
    SubscriptionAdminController,
    MusicBackgroundAdminController,
    StockAssetAdminController,
    ContactAdminController,
    ReviewAdminController,
    NotificationAdminController,
    ActionLogController,
    AnalyticsAdminController,
  ],
  imports: [
    AuthModule,
    CustomerModule,
    TemplateModule,
    TemplateCategoryModule,
    InvitationModule,
    WeddingInfoModule,
    GuestModule,
    WishModule,
    PhotoWallModule,
    ServicePlanModule,
    SubscriptionModule,
    MusicBackgroundModule,
    StockAssetModule,
    ContactModule,
    ReviewModule,
    NotificationModule,
    ActionLogModule,
    AnalyticsModule,
  ],
})
export class AdminModule {}
