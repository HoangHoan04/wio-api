import { ChildModule } from '@/common/decorators';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ActionLogController } from '../action-log/action-log.controller';
import { ActionLogModule } from '../action-log/action-log.module';
import { AuthModule } from '../auth/auth.module';
import { AuthAdminController } from '../auth/controller/auth-admin.controller';
import { PREFIX_MODULE } from '../config-module';
import { ContactAdminController } from '../contact/controllers/contact-admin.controller';
import { ContactModule } from '../contact/contact.module';
import { CustomerAdminController } from '../customer/controllers/customer-admin.controller';
import { CustomerModule } from '../customer/customer.module';
import { GuestAdminController } from '../guest/controllers/guest-admin.controller';
import { GuestModule } from '../guest/guest.module';
import { MusicBackgroundAdminController } from '../music-background/controllers/music-background-admin.controller';
import { MusicBackgroundModule } from '../music-background/music-background.module';
import { PhotoWallAdminController } from '../photo-wall/controllers/photo-wall-admin.controller';
import { PhotoWallModule } from '../photo-wall/photo-wall.module';
import { ServicePlanAdminController } from '../service-plan/controllers/service-plan-admin.controller';
import { ServicePlanModule } from '../service-plan/service-plan.module';
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
    ServicePlanAdminController,
    SubscriptionAdminController,
    ActionLogController,
    CustomerAdminController,
    MusicBackgroundAdminController,
    GuestAdminController,
    ContactAdminController,
  ],
  imports: [
    AuthModule,
    TemplateModule,
    WeddingModule,
    WishModule,
    PhotoWallModule,
    ServicePlanModule,
    SubscriptionModule,
    ActionLogModule,
    CustomerModule,
    MusicBackgroundModule,
    GuestModule,
    ContactModule,
  ],
  exports: [],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
