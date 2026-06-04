import { ChildModule } from '@/common/decorators';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthUserController } from '../auth/controller/auth-user.controller';
import { PREFIX_MODULE } from '../config-module';
import { GuestGroupUserController } from '../guest-group/controllers/guest-group-user.controller';
import { GuestGroupModule } from '../guest-group/guest-group.module';
import { GuestUserController } from '../guest/controllers/guest-user.controller';
import { GuestModule } from '../guest/guest.module';
import { NotificationUserController } from '../notification/controllers/notification-user.controller';
import { NotificationModule } from '../notification/notification.module';
import { PhotoWallUserController } from '../photo-wall/controllers/photo-wall-user.controller';
import { PhotoWallModule } from '../photo-wall/photo-wall.module';
import { ServicePlanUserController } from '../service-plan/controllers/service-plan-user.controller';
import { ServicePlanModule } from '../service-plan/service-plan.module';
import { SubscriptionUserController } from '../subscription/controllers/subscription-user.controller';
import { SubscriptionModule } from '../subscription/subscription.module';
import { TableUserController } from '../table/controllers/table-user.controller';
import { TableModule } from '../table/table.module';
import { TemplateModule } from '../template/template.module';
import { WeddingPhotoUserController } from '../wedding-photo/controllers/wedding-photo-user.controller';
import { WeddingPhotoModule } from '../wedding-photo/wedding-photo.module';
import { WeddingUserController } from '../wedding/controllers/wedding-user.controller';
import { WeddingModule } from '../wedding/wedding.module';
import { WishUserController } from '../wish/controllers/wish-user.controller';
import { WishModule } from '../wish/wish.module';
import { TemplateUserController } from '../template/controllers/template-user.controller';
import { MusicBackgroundModule } from '../music-background/music-background.module';
import { MusicBackgroundUserController } from '../music-background/controllers/music-background-user.controller';

@ChildModule({
  prefix: PREFIX_MODULE.user,
  controllers: [
    AuthUserController,
    TemplateUserController,
    WeddingUserController,
    WeddingPhotoUserController,
    GuestGroupUserController,
    GuestUserController,
    TableUserController,
    WishUserController,
    PhotoWallUserController,
    NotificationUserController,
    ServicePlanUserController,
    SubscriptionUserController,
    MusicBackgroundUserController,
  ],
  imports: [
    AuthModule,
    TemplateModule,
    WeddingModule,
    WeddingPhotoModule,
    GuestGroupModule,
    GuestModule,
    TableModule,
    WishModule,
    PhotoWallModule,
    NotificationModule,
    ServicePlanModule,
    SubscriptionModule,
    MusicBackgroundModule
  ],
  exports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
