import { ChildModule } from '@/common/decorators';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import {
  AnalyticsAdminController,
  AnalyticsModule,
} from '../analytics/analytics.module';
import { AuthModule } from '../auth/auth.module';
import { AuthAdminController } from '../auth/controller/auth-admin.controller';
import { PREFIX_MODULE } from '../config-module';
import { PhotoWallAdminController } from '../photo-wall/controllers/photo-wall-admin.controller';
import { PhotoWallModule } from '../photo-wall/photo-wall.module';
import { SubscriptionAdminController } from '../subscription/controllers/subscription-admin.controller';
import { SubscriptionModule } from '../subscription/subscription.module';
import { TemplateAdminController } from '../template/controllers/template-admin.controller';
import { TemplateModule } from '../template/template.module';
import { WeddingAdminController } from '../wedding/controllers/wedding-admin.controller';
import { WeddingModule } from '../wedding/wedding.module';
import { WishAdminController } from '../wish/controllers/wish-admin.controller';
import { WishModule } from '../wish/wish.module';

@ChildModule({
  prefix: PREFIX_MODULE.admin,
  controllers: [
    AuthAdminController,
    TemplateAdminController,
    WeddingAdminController,
    WishAdminController,
    PhotoWallAdminController,
    SubscriptionAdminController,
    AnalyticsAdminController,
  ],
  imports: [
    AuthModule,
    TemplateModule,
    WeddingModule,
    WishModule,
    PhotoWallModule,
    SubscriptionModule,
    AnalyticsModule,
  ],
  exports: [],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
