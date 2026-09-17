import { ChildModule } from '@/common/decorators';
import { AnalyticsModule } from '../analytics/analytics.module';
import { AnalyticsPublicController } from '../analytics/controllers/analytics-public.controller';
import { PREFIX_MODULE } from '../config-module';
import { ContactModule } from '../contact/contact.module';
import { ContactPublicController } from '../contact/controllers/contact-public.controller';
import { GuestPublicController } from '../guest/controllers/guest-public.controller';
import { GuestModule } from '../guest/guest.module';
import { InvitationPublicController } from '../invitation/controllers/invitation-public.controller';
import { InvitationModule } from '../invitation/invitation.module';
import { PhotoWallPublicController } from '../photo-wall/controllers/photo-wall-public.controller';
import { PhotoWallModule } from '../photo-wall/photo-wall.module';
import { ReviewPublicController } from '../review/controllers/review-public.controller';
import { ReviewModule } from '../review/review.module';
import { ServicePlanPublicController } from '../service-plan/controllers/service-plan-public.controller';
import { ServicePlanModule } from '../service-plan/service-plan.module';
import { StockAssetPublicController } from '../stock-asset/controllers/stock-asset-public.controller';
import { StockAssetModule } from '../stock-asset/stock-asset.module';
import { TableModule } from '../table/table.module';
import { TemplatePublicController } from '../template/controllers/template-public.controller';
import { TemplateModule } from '../template/template.module';
import { WeddingInfoPublicController } from '../wedding-info/controllers/wedding-info-public.controller';
import { WeddingInfoModule } from '../wedding-info/wedding-info.module';
import { WishPublicController } from '../wish/controllers/wish-public.controller';
import { WishModule } from '../wish/wish.module';

/**
 * PublicModule — Nhóm tất cả controller công khai vào 1 prefix /public.
 *
 * Route ví dụ:
 *   - GET /public/invitation/find-by-slug/:slug
 *   - POST /public/wish/create
 *   - GET /public/template/list
 *
 * ⚠️ Các route trong module này KHÔNG cần đăng nhập.
 * ⚠️ Prefix `public` áp dụng cho TẤT CẢ controller bên dưới.
 */
@ChildModule({
  prefix: PREFIX_MODULE.public,
  controllers: [
    // ---- Thiệp cưới ----
    InvitationPublicController,
    WeddingInfoPublicController,
    TemplatePublicController,
    GuestPublicController,
    // ---- Tương tác ----
    WishPublicController,
    PhotoWallPublicController,
    ReviewPublicController,
    ContactPublicController,
    // ---- Nội dung ----
    StockAssetPublicController,
    // ---- Dịch vụ ----
    ServicePlanPublicController,
    // ---- Analytics ----
    AnalyticsPublicController,
  ],
  imports: [
    InvitationModule,
    WeddingInfoModule,
    TemplateModule,
    GuestModule,
    TableModule,
    WishModule,
    PhotoWallModule,
    ReviewModule,
    ContactModule,
    StockAssetModule,
    ServicePlanModule,
    AnalyticsModule,
  ],
})
export class PublicModule {}
