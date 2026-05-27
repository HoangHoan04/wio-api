import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GuestModule } from '../guest/guest.module';
import { TableModule } from '../table/table.module';
import { WeddingModule } from '../wedding/wedding.module';
import { WishModule } from '../wish/wish.module';

import { PublicAuthController } from './controllers/public-auth.controller';
import { PublicGuestController } from './controllers/public-guest.controller';
import { PublicSlugController } from './controllers/public-slug.controller';
import { PublicWeddingController } from './controllers/public-wedding.controller';
import { PublicWishController } from './controllers/public-wish.controller';

import { RestGuestController } from './controllers/rest-guest.controller';
import { RestTableController } from './controllers/rest-table.controller';
import { RestWeddingController } from './controllers/rest-wedding.controller';

@Module({
  imports: [AuthModule, WeddingModule, GuestModule, TableModule, WishModule],
  controllers: [
    PublicAuthController,
    PublicWeddingController,
    PublicSlugController,
    PublicGuestController,
    PublicWishController,
    RestWeddingController,
    RestGuestController,
    RestTableController,
  ],
  providers: [],
})
export class PublicApiModule {}
