import { MigrationInterface, QueryRunner } from 'typeorm';

export class MiinitData1786629001756 implements MigrationInterface {
  name = 'MiinitData1786629001756';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "guest_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "invitationId" uuid NOT NULL, "code" character varying(40) NOT NULL, "name" character varying(80) NOT NULL, "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_4fbeadf123f31f44b0be0c5414e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ed52cb9300a8b796b68fa6e9f0" ON "guest_groups" ("invitationId", "code") WHERE "isDeleted" = false`,
    );
    await queryRunner.query(
      `CREATE TABLE "tables" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "invitationId" uuid NOT NULL, "name" character varying(50) NOT NULL, "maxSeats" smallint NOT NULL DEFAULT '10', "currentSeats" smallint DEFAULT '0', "description" character varying(255), "positionX" integer, "positionY" integer, CONSTRAINT "PK_7cf2aca7af9550742f855d4eb69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "guests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "invitationId" uuid NOT NULL, "groupId" uuid, "tableId" uuid, "fullName" character varying(100) NOT NULL, "salutation" character varying(20), "isVip" boolean NOT NULL DEFAULT false, "invitationCode" character varying(32) NOT NULL, "qrCodeUrl" text, "rsvpStatus" character varying(20) NOT NULL, "attendingCount" smallint NOT NULL DEFAULT '1', "needsTransport" boolean NOT NULL DEFAULT false, "rsvpNote" text, "rsvpAt" TIMESTAMP WITH TIME ZONE, "invitedAt" TIMESTAMP WITH TIME ZONE, "invitationViewedAt" TIMESTAMP WITH TIME ZONE, "checkedInAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_47425d181c5b741f25e948e37d5" UNIQUE ("invitationCode"), CONSTRAINT "PK_4948267e93869ddcc6b340a2c46" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9e682d8a5a84d9944c855b3a26" ON "guests" ("invitationId", "tableId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e4dad362db08430c140877baae" ON "guests" ("invitationId", "rsvpStatus") `,
    );
    await queryRunner.query(
      `CREATE TABLE "invitation_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "invitationId" uuid NOT NULL, "eventKey" character varying(40) NOT NULL, "title" character varying(255) NOT NULL, "startsAt" TIMESTAMP WITH TIME ZONE, "venue" character varying(255), "address" text, "mapsUrl" text, "lat" numeric(10,7), "lng" numeric(10,7), "dressCode" text, "isPrimary" boolean NOT NULL DEFAULT false, "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_aeba8a6698698075fe9a2656bdb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invitation_gifts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "invitationId" uuid NOT NULL, "label" character varying(150) NOT NULL, "bankName" character varying(100), "accountNumber" character varying(50), "accountOwner" character varying(100), "qrUrl" text, "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_8049051d42c5ad342cc2232b533" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invitation_hosts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "invitationId" uuid NOT NULL, "role" character varying(40) NOT NULL, "fullName" character varying(150) NOT NULL, "shortName" character varying(80), "honorific" character varying(80), "photoUrl" text, "dob" date, "bio" text, "family" jsonb, "extra" jsonb, "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_88a9ee5697374f129a2b479f9bf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invitation_photos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "invitationId" uuid NOT NULL, "url" text NOT NULL, "storageKey" character varying(500), "caption" character varying(255), "kind" character varying(20) NOT NULL DEFAULT 'GALLERY', "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_bb45b80161823427aa08db2deff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invitation_timelines" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "invitationId" uuid NOT NULL, "eventId" uuid, "timeLabel" character varying(50), "title" character varying(255) NOT NULL, "description" text, "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_d846abafc2715c9fa39d3970bfb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying(50) NOT NULL, "maxInvitations" integer NOT NULL DEFAULT '1', "maxGuests" integer NOT NULL, "maxPhotos" integer NOT NULL, "hasAi" boolean NOT NULL DEFAULT false, "hasAnalytics" boolean NOT NULL DEFAULT false, "hasCustomSlug" boolean NOT NULL DEFAULT false, "durationDays" integer NOT NULL, "priceVnd" bigint NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_679a9e435f1af95a94d9749a087" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "template_card_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "templateId" uuid NOT NULL, "cardType" character varying(40) NOT NULL, CONSTRAINT "PK_c99b057a9e37ab499763e166eb4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ae51a162460ffaac70a67901c8" ON "template_card_types" ("templateId", "cardType") `,
    );
    await queryRunner.query(
      `CREATE TABLE "templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying(100) NOT NULL, "description" character varying(255), "slug" character varying(100) NOT NULL, "tags" text, "styleTags" text, "colorMood" character varying(50), "features" json, "thumbnailUrl" text, "themeCode" character varying(100) NOT NULL, "isShow" boolean NOT NULL DEFAULT true, "isPremium" boolean NOT NULL DEFAULT false, "min_plan_id" uuid, "trialDays" integer NOT NULL DEFAULT '3', "viewCount" integer NOT NULL DEFAULT '0', "previewCount" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_996873c57c54937eba59605def3" UNIQUE ("slug"), CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "code" character varying(50), "fullName" character varying(100) NOT NULL, "email" character varying(255), "phone" character varying(20), "gender" character varying(20), "dateOfBirth" TIMESTAMP WITH TIME ZONE, "avatarUrl" text, CONSTRAINT "UQ_b8512aa9cef03d90ed5744c94d7" UNIQUE ("userId"), CONSTRAINT "REL_b8512aa9cef03d90ed5744c94d" UNIQUE ("userId"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "password" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "refreshToken" text, "lastLogin" TIMESTAMP WITH TIME ZONE, "phone" character varying(20), "role" character varying(20), "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "templateId" uuid, "cardType" character varying(40) NOT NULL, "title" character varying(200) NOT NULL, "slug" character varying(100) NOT NULL, "status" character varying(20) NOT NULL, "invitationText" text, "thankYouText" text, "hashtag" character varying(80), "heroImageUrl" text, "primaryEventAt" TIMESTAMP WITH TIME ZONE, "sectionConfig" jsonb, "enabledModules" jsonb, "music" jsonb, "extraContent" jsonb, "customDesign" jsonb, "coverConfig" jsonb, "publishedAt" TIMESTAMP WITH TIME ZONE, "expiresAt" TIMESTAMP WITH TIME ZONE, "shareUrl" text, "shareQrUrl" text, "viewCount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_5dec98cfdfd562e4ad3648bbb07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c16fdad3aea7ec7b047aedb9af" ON "invitations" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cdd5876e88807a3b5c0209d69d" ON "invitations" ("cardType") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_56ce8d405de7cdcedd31d900ba" ON "invitations" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3bf63ca087f62a08e403cb8258" ON "invitations" ("primaryEventAt") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_invitation_slug" ON "invitations" ("slug") WHERE "status" != 'ARCHIVED' AND "isDeleted" = false`,
    );
    await queryRunner.query(
      `CREATE TABLE "wishes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "invitationId" uuid NOT NULL, "guestId" uuid, "guestName" character varying(100) NOT NULL, "content" text NOT NULL, "isApproved" boolean NOT NULL DEFAULT true, "isPinned" boolean NOT NULL DEFAULT false, "approvedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9c08d144e42ca0aa37a024597ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e567802a4d82e32ae7e00dae2e" ON "wishes" ("invitationId", "isApproved") `,
    );
    await queryRunner.query(
      `CREATE TABLE "verify_otps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "identifier" character varying(255) NOT NULL, "otpCode" character varying(10) NOT NULL, "method" character varying(20) NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_0d71e8ff7eee7844831e3f3af55" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid, "accessToken" text, "refreshToken" text, "ipAddress" character varying(50), "userAgent" character varying(255), "expiresAt" TIMESTAMP WITH TIME ZONE, "isRevoked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "promotions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(50) NOT NULL, "name" character varying(150) NOT NULL, "discountType" character varying(20) NOT NULL, "discountValue" bigint NOT NULL, "maxUses" integer, "usedCount" integer NOT NULL DEFAULT '0', "startsAt" TIMESTAMP WITH TIME ZONE, "endsAt" TIMESTAMP WITH TIME ZONE, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_8ab10e580f70c3d2e2e4b31ebf2" UNIQUE ("code"), CONSTRAINT "PK_380cecbbe3ac11f0e5a7c452c34" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "planId" uuid NOT NULL, "status" character varying(255) NOT NULL, "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df76e81987c46fdacee7c6dcdc" ON "subscriptions" ("status", "expiresAt") `,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "subscriptionId" uuid, "promotionId" uuid, "amountVnd" bigint NOT NULL, "method" character varying(30) NOT NULL, "status" character varying(30) NOT NULL, "providerRef" character varying(255), "rawPayload" jsonb, "paidAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6bb58f2b6e30cb51a6504599f4" ON "transactions" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_da87c55b3bbbe96c6ed88ea7ee" ON "transactions" ("status") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1ba7414cfad49c97d1c567e295" ON "transactions" ("providerRef") WHERE "providerRef" IS NOT NULL AND "isDeleted" = false`,
    );
    await queryRunner.query(
      `CREATE TABLE "slug_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "invitationId" uuid NOT NULL, "oldSlug" character varying(100) NOT NULL, "newSlug" character varying(100) NOT NULL, "changedBy" uuid NOT NULL, "reason" text NOT NULL, CONSTRAINT "PK_8a2ec7e164f496a7b5ecd3bb335" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_09ad80453a68e6263e0b73b36a" ON "slug_history" ("invitationId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "photo_wall" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "invitationId" uuid NOT NULL, "guestId" uuid, "uploaderName" character varying(100) NOT NULL, "url" text NOT NULL, "storageKey" character varying(500), "caption" character varying(255), "isApproved" boolean NOT NULL DEFAULT true, "approvedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f855d3c717415b24d8e3ad64136" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cce2a297871b91702b702bac2b" ON "photo_wall" ("invitationId", "isApproved") `,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "invitationId" uuid NOT NULL, "guestId" uuid, "channel" character varying(255) NOT NULL, "type" character varying(255) NOT NULL, "subject" character varying(255), "content" text NOT NULL, "status" character varying(255) NOT NULL, "scheduledAt" TIMESTAMP WITH TIME ZONE NOT NULL, "sentAt" TIMESTAMP WITH TIME ZONE, "failedReason" text, "provider" character varying(50), "providerMsgId" character varying(255), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_54e1725163ede8bf2ce08874a6" ON "notifications" ("guestId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ab221329a9f4c2111690d52f34" ON "notifications" ("scheduledAt", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bbc7822f5247b7de25eee9f0a2" ON "notifications" ("invitationId", "status") `,
    );
    await queryRunner.query(
      `CREATE TABLE "music_backgrounds" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying(255) NOT NULL, "author" character varying(255), "duration" character varying(50), "usageCount" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "status" character varying(20) NOT NULL, "youtubeUrl" text, "audioUrl" text, "type" character varying(20) NOT NULL DEFAULT 'admin', CONSTRAINT "PK_9715fb49ec7050470fb1521db7b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(50), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "phone" character varying(50), "subject" character varying(255), "message" text NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'PENDING', "admin_note" text, "responded_at" TIMESTAMP, "responded_by" character varying(36), "created_by_id" character varying(36), CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(40) NOT NULL, "nameVi" character varying(100) NOT NULL, "nameEn" character varying(100), "slug" character varying(80) NOT NULL, "description" text, "icon" character varying(50), "accentColor" character varying(20), "defaultModules" jsonb, "defaultGuestGroups" jsonb, "hostRoles" jsonb, "wizardSections" jsonb, "sortOrder" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_24ca65c8a519abca76b3543b214" UNIQUE ("code"), CONSTRAINT "UQ_ed4355e13514e30a6a6241127a0" UNIQUE ("slug"), CONSTRAINT "PK_2e832349781fa27274c3dbdeb30" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "action-logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "createdById" uuid NOT NULL, "createdByCode" character varying(255) NOT NULL, "createdByName" character varying(255) NOT NULL, "createdNote" text, "actionType" character varying(255), "entityId" uuid, "entityName" character varying(255), "oldValue" jsonb, "newValue" jsonb, "ipAddress" character varying(255), "userAgent" text, "location" character varying(255), CONSTRAINT "PK_ffb219d8978756f5e8cfd9e7efe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" ADD CONSTRAINT "FK_cef580ad342dab959ccb6f78bd2" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tables" ADD CONSTRAINT "FK_62c8a1d4d23e7cc6a5acbb41df8" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ADD CONSTRAINT "FK_f1a1e3ce7ddcd20c0d27a61b86b" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ADD CONSTRAINT "FK_f52db5017ebcff092698d22ea0c" FOREIGN KEY ("groupId") REFERENCES "guest_groups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ADD CONSTRAINT "FK_6480f9e34b521067db2cd1bb9f9" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_events" ADD CONSTRAINT "FK_02378750243ae0c825ef32a8fec" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_gifts" ADD CONSTRAINT "FK_a4e94ef50b4f1b0e1dae4deb88a" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_hosts" ADD CONSTRAINT "FK_407188bc456f9fdadfff3d88d4f" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_photos" ADD CONSTRAINT "FK_4c548a684f28a2dff1e63da1707" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_timelines" ADD CONSTRAINT "FK_85030085c2a167ec4fe3dbf2268" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "template_card_types" ADD CONSTRAINT "FK_7ac3c33b94a4f07b29da888d6a4" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ADD CONSTRAINT "FK_c1e091ac12afc10334ed795688b" FOREIGN KEY ("min_plan_id") REFERENCES "service_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ADD CONSTRAINT "FK_b8512aa9cef03d90ed5744c94d7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" ADD CONSTRAINT "FK_c16fdad3aea7ec7b047aedb9afe" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" ADD CONSTRAINT "FK_0aad0a3d2486c04dea163f7fe51" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishes" ADD CONSTRAINT "FK_fa7fc3b5894150c3e66c0763eed" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_7536cba909dd7584a4640cad7d5" FOREIGN KEY ("planId") REFERENCES "service_plans"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_68b3182f3f5d4d5a0f41c12139b" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_702c945623383dc1c80a8095bdf" FOREIGN KEY ("promotionId") REFERENCES "promotions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "slug_history" ADD CONSTRAINT "FK_09ad80453a68e6263e0b73b36a9" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "photo_wall" ADD CONSTRAINT "FK_dd81572da219f9ad21086a8d2fc" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "photo_wall" DROP CONSTRAINT "FK_dd81572da219f9ad21086a8d2fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "slug_history" DROP CONSTRAINT "FK_09ad80453a68e6263e0b73b36a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_702c945623383dc1c80a8095bdf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_68b3182f3f5d4d5a0f41c12139b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_7536cba909dd7584a4640cad7d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishes" DROP CONSTRAINT "FK_fa7fc3b5894150c3e66c0763eed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" DROP CONSTRAINT "FK_0aad0a3d2486c04dea163f7fe51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" DROP CONSTRAINT "FK_c16fdad3aea7ec7b047aedb9afe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" DROP CONSTRAINT "FK_b8512aa9cef03d90ed5744c94d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" DROP CONSTRAINT "FK_c1e091ac12afc10334ed795688b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "template_card_types" DROP CONSTRAINT "FK_7ac3c33b94a4f07b29da888d6a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_timelines" DROP CONSTRAINT "FK_85030085c2a167ec4fe3dbf2268"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_photos" DROP CONSTRAINT "FK_4c548a684f28a2dff1e63da1707"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_hosts" DROP CONSTRAINT "FK_407188bc456f9fdadfff3d88d4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_gifts" DROP CONSTRAINT "FK_a4e94ef50b4f1b0e1dae4deb88a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_events" DROP CONSTRAINT "FK_02378750243ae0c825ef32a8fec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" DROP CONSTRAINT "FK_6480f9e34b521067db2cd1bb9f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" DROP CONSTRAINT "FK_f52db5017ebcff092698d22ea0c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" DROP CONSTRAINT "FK_f1a1e3ce7ddcd20c0d27a61b86b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tables" DROP CONSTRAINT "FK_62c8a1d4d23e7cc6a5acbb41df8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" DROP CONSTRAINT "FK_cef580ad342dab959ccb6f78bd2"`,
    );
    await queryRunner.query(`DROP TABLE "action-logs"`);
    await queryRunner.query(`DROP TABLE "card_types"`);
    await queryRunner.query(`DROP TABLE "contacts"`);
    await queryRunner.query(`DROP TABLE "music_backgrounds"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bbc7822f5247b7de25eee9f0a2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ab221329a9f4c2111690d52f34"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_54e1725163ede8bf2ce08874a6"`,
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cce2a297871b91702b702bac2b"`,
    );
    await queryRunner.query(`DROP TABLE "photo_wall"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_09ad80453a68e6263e0b73b36a"`,
    );
    await queryRunner.query(`DROP TABLE "slug_history"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1ba7414cfad49c97d1c567e295"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_da87c55b3bbbe96c6ed88ea7ee"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6bb58f2b6e30cb51a6504599f4"`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_df76e81987c46fdacee7c6dcdc"`,
    );
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TABLE "promotions"`);
    await queryRunner.query(`DROP TABLE "user_tokens"`);
    await queryRunner.query(`DROP TABLE "verify_otps"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e567802a4d82e32ae7e00dae2e"`,
    );
    await queryRunner.query(`DROP TABLE "wishes"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_invitation_slug"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3bf63ca087f62a08e403cb8258"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_56ce8d405de7cdcedd31d900ba"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cdd5876e88807a3b5c0209d69d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c16fdad3aea7ec7b047aedb9af"`,
    );
    await queryRunner.query(`DROP TABLE "invitations"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TABLE "templates"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ae51a162460ffaac70a67901c8"`,
    );
    await queryRunner.query(`DROP TABLE "template_card_types"`);
    await queryRunner.query(`DROP TABLE "service_plans"`);
    await queryRunner.query(`DROP TABLE "invitation_timelines"`);
    await queryRunner.query(`DROP TABLE "invitation_photos"`);
    await queryRunner.query(`DROP TABLE "invitation_hosts"`);
    await queryRunner.query(`DROP TABLE "invitation_gifts"`);
    await queryRunner.query(`DROP TABLE "invitation_events"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e4dad362db08430c140877baae"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9e682d8a5a84d9944c855b3a26"`,
    );
    await queryRunner.query(`DROP TABLE "guests"`);
    await queryRunner.query(`DROP TABLE "tables"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ed52cb9300a8b796b68fa6e9f0"`,
    );
    await queryRunner.query(`DROP TABLE "guest_groups"`);
  }
}
