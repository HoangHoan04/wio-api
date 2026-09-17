import { ChildModule } from '@/common/decorators';
import { AuthModule } from '../auth/auth.module';
import { AuthUserController } from '../auth/controller/auth-user.controller';
import { PREFIX_MODULE } from '../config-module';
import { GuestUserController } from '../guest/controllers/guest-user.controller';
import { GuestModule } from '../guest/guest.module';
import { InvitationUserController } from '../invitation/controllers/invitation-user.controller';
import { InvitationModule } from '../invitation/invitation.module';
import { MusicBackgroundUserController } from '../music-background/controllers/music-background-user.controller';
import { MusicBackgroundModule } from '../music-background/music-background.module';
import { NotificationUserController } from '../notification/controllers/notification-user.controller';
import { NotificationModule } from '../notification/notification.module';
import { PhotoWallUserController } from '../photo-wall/controllers/photo-wall-user.controller';
import { PhotoWallModule } from '../photo-wall/photo-wall.module';
import { ServicePlanUserController } from '../service-plan/controllers/service-plan-user.controller';
import { ServicePlanModule } from '../service-plan/service-plan.module';
import { StockAssetModule } from '../stock-asset/stock-asset.module';
import { SubscriptionUserController } from '../subscription/controllers/subscription-user.controller';
import { SubscriptionModule } from '../subscription/subscription.module';
import { TableUserController } from '../table/controllers/table-user.controller';
import { TableModule } from '../table/table.module';
import { TemplateUserController } from '../template/controllers/template-user.controller';
import { TemplateModule } from '../template/template.module';
import { WeddingInfoUserController } from '../wedding-info/controllers/wedding-info-user.controller';
import { WeddingInfoModule } from '../wedding-info/wedding-info.module';
import { WishUserController } from '../wish/controllers/wish-user.controller';
import { WishModule } from '../wish/wish.module';

/**
 * UserModule — Nhóm tất cả controller user vào 1 prefix /user.
 *
 * Route ví dụ:
 *   - POST /user/auth/login
 *   - POST /user/invitation/pagination
 *   - POST /user/guest/pagination
 *
 * ⚠️ Prefix `user` áp dụng cho TẤT CẢ controller bên dưới.
 */
@ChildModule({
  prefix: PREFIX_MODULE.user,
  controllers: [
    AuthUserController,
    // ---- Thiệp cưới ----
    TemplateUserController,
    InvitationUserController,
    WeddingInfoUserController,
    GuestUserController,
    TableUserController,
    WishUserController,
    PhotoWallUserController,
    // ---- Dịch vụ ----
    ServicePlanUserController,
    SubscriptionUserController,
    // ---- Nội dung ----
    MusicBackgroundUserController,
    // ---- Thông báo ----
    NotificationUserController,
  ],
  imports: [
    AuthModule,
    TemplateModule,
    InvitationModule,
    WeddingInfoModule,
    GuestModule,
    TableModule,
    WishModule,
    PhotoWallModule,
    ServicePlanModule,
    SubscriptionModule,
    MusicBackgroundModule,
    StockAssetModule,
    NotificationModule,
  ],
})
export class UserModule {}
