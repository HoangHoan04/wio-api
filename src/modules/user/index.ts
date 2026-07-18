import { ChildModule } from '@/common/decorators';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthUserController } from '../auth/controller/auth-user.controller';
import { PREFIX_MODULE } from '../config-module';
import { GiphyUserController } from '../giphy/controllers/giphy-user.controller';
import { GiphyModule } from '../giphy/giphy.module';
import { GuestPublicController } from '../guest/controllers/guest-public.controller';
import { GuestUserController } from '../guest/controllers/guest-user.controller';
import { GuestModule } from '../guest/guest.module';
import { MusicBackgroundUserController } from '../music-background/controllers/music-background-user.controller';
import { MusicBackgroundModule } from '../music-background/music-background.module';
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
import { TemplateUserController } from '../template/controllers/template-user.controller';
import { TemplateModule } from '../template/template.module';
import { WeddingPhotoUserController } from '../wedding-photo/controllers/wedding-photo-user.controller';
import { WeddingPhotoModule } from '../wedding-photo/wedding-photo.module';
import { WeddingPublicController } from '../wedding/controllers/wedding-public.controller';
import { WeddingUserController } from '../wedding/controllers/wedding-user.controller';
import { WeddingModule } from '../wedding/wedding.module';
import { WishUserController } from '../wish/controllers/wish-user.controller';
import { WishModule } from '../wish/wish.module';

@ChildModule({
  prefix: PREFIX_MODULE.user,
  controllers: [
    AuthUserController,
    TemplateUserController,
    WeddingUserController,
    WeddingPhotoUserController,
    GuestUserController,
    GuestPublicController,
    TableUserController,
    WishUserController,
    PhotoWallUserController,
    NotificationUserController,
    ServicePlanUserController,
    SubscriptionUserController,
    MusicBackgroundUserController,
    GiphyUserController,
    WeddingPublicController,
  ],
  imports: [
    AuthModule,
    TemplateModule,
    WeddingModule,
    WeddingPhotoModule,
    GuestModule,
    TableModule,
    WishModule,
    PhotoWallModule,
    NotificationModule,
    ServicePlanModule,
    SubscriptionModule,
    MusicBackgroundModule,
    GiphyModule,
  ],
  exports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
