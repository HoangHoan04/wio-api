import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitData1779784302384 implements MigrationInterface {
  name = 'InitData1779784302384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wishes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "weddingId" uuid NOT NULL, "guestId" uuid, "guestName" character varying(100) NOT NULL, "content" text NOT NULL, "isApproved" boolean NOT NULL DEFAULT true, "isPinned" boolean NOT NULL DEFAULT false, "approvedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_9c08d144e42ca0aa37a024597ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8894238eb957015349a374b0b9" ON "wishes" ("weddingId", "isApproved") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."weddings_musictype_enum" AS ENUM('upload', 'youtube', 'spotify')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."weddings_status_enum" AS ENUM('draft', 'published', 'archived')`,
    );
    await queryRunner.query(
      `CREATE TABLE "weddings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "templateId" uuid, "slug" character varying(100) NOT NULL, "groomName" character varying(100) NOT NULL, "groomDob" TIMESTAMP WITH TIME ZONE, "groomFatherName" character varying(100), "groomMotherName" character varying(100), "groomPhotoUrl" text, "brideName" character varying(100) NOT NULL, "brideDob" TIMESTAMP WITH TIME ZONE, "brideFatherName" character varying(100), "brideMotherName" character varying(100), "bridePhotoUrl" text, "engagementAt" TIMESTAMP WITH TIME ZONE, "engagementVenue" character varying(255), "engagementAddress" text, "engagementMapsUrl" text, "ceremonyAt" TIMESTAMP WITH TIME ZONE NOT NULL, "ceremonyVenue" character varying(255) NOT NULL, "ceremonyAddress" text, "ceremonyMapsUrl" text, "ceremonyLat" numeric(10,7), "ceremonyLng" numeric(10,7), "receptionAt" TIMESTAMP WITH TIME ZONE, "receptionVenue" character varying(255), "receptionAddress" text, "receptionMapsUrl" text, "receptionLat" numeric(10,7), "receptionLng" numeric(10,7), "invitationText" text, "loveStory" text, "hashtag" character varying(100), "musicUrl" text, "musicType" "public"."weddings_musictype_enum", "musicAutoplay" boolean NOT NULL DEFAULT false, "bankAccountNumber" character varying(50), "bankName" character varying(100), "bankAccountName" character varying(100), "bankTransferNote" character varying(255), "vietqrUrl" text, "status" "public"."weddings_status_enum" NOT NULL DEFAULT 'draft', "publishedAt" TIMESTAMP WITH TIME ZONE, "expiresAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_1205c1b99fdfea139487f672455" UNIQUE ("slug"), CONSTRAINT "PK_89ac96640074af9ed5464bc408c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a19a4ab35aebe81eb108ae24ed" ON "weddings" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4973f8ebed8ca01d043702b330" ON "weddings" ("status") `,
    );
    await queryRunner.query(
      `CREATE TABLE "wedding_photos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "weddingId" uuid NOT NULL, "url" text NOT NULL, "storageKey" character varying(500), "caption" character varying(255), "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_ebf2b3eeb79d69f92b69d021fef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ca00a09434bbefb8d85fa2b05" ON "wedding_photos" ("weddingId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "verify_otps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "identifier" character varying(255) NOT NULL, "otpCode" character varying(10) NOT NULL, "method" character varying(20) NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_0d71e8ff7eee7844831e3f3af55" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('couple', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "email" character varying(255) NOT NULL, "passwordHash" character varying(255) NOT NULL, "fullName" character varying(100) NOT NULL, "phone" character varying(20), "role" "public"."users_role_enum" NOT NULL DEFAULT 'couple', "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying(100) NOT NULL, "thumbnailUrl" text, "cssConfig" jsonb, "previewUrl" text, "isActive" boolean NOT NULL DEFAULT true, "isPremium" boolean NOT NULL DEFAULT false, "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "userId" character varying(36) NOT NULL, "accessToken" text, "refreshToken" text, "ipAddress" character varying(50), "userAgent" character varying(255), "expiresAt" TIMESTAMP WITH TIME ZONE, "isRevoked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tables" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "weddingId" uuid NOT NULL, "name" character varying(50) NOT NULL, "maxSeats" smallint NOT NULL DEFAULT '10', "currentSeats" smallint NOT NULL DEFAULT '0', "description" character varying(255), "positionX" integer, "positionY" integer, CONSTRAINT "PK_7cf2aca7af9550742f855d4eb69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d0988b541d054a5913ba7e4fac" ON "tables" ("weddingId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "system-configs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(100) NOT NULL, "name" character varying(250) NOT NULL, "type" character varying(255) NOT NULL, "value" jsonb NOT NULL, CONSTRAINT "UQ_e2b0e7ba52ac5cdeb75897a3cbc" UNIQUE ("code"), CONSTRAINT "UQ_97303fdce41aacdd75af09e984f" UNIQUE ("name"), CONSTRAINT "PK_077a99241e1969e54baddb32c40" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."subscriptions_status_enum" AS ENUM('active', 'expired', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "weddingId" uuid NOT NULL, "planId" uuid NOT NULL, "status" "public"."subscriptions_status_enum" NOT NULL DEFAULT 'active', "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "paidAmountVnd" bigint, "paymentMethod" character varying(50), "paymentRef" character varying(255), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fbdba4e2ac694cf8c9cecf4dc8" ON "subscriptions" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_466cb9605c1638a4870e32344d" ON "subscriptions" ("weddingId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df76e81987c46fdacee7c6dcdc" ON "subscriptions" ("status", "expiresAt") `,
    );
    await queryRunner.query(
      `CREATE TABLE "service_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying(50) NOT NULL, "maxGuests" integer NOT NULL, "maxPhotos" integer NOT NULL, "maxTemplates" integer NOT NULL, "hasAi" boolean NOT NULL DEFAULT false, "hasAnalytics" boolean NOT NULL DEFAULT false, "hasCustomSlug" boolean NOT NULL DEFAULT false, "durationDays" integer NOT NULL, "priceVnd" bigint NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_679a9e435f1af95a94d9749a087" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "photo_wall" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "weddingId" uuid NOT NULL, "guestId" uuid, "uploaderName" character varying(100) NOT NULL, "url" text NOT NULL, "storageKey" character varying(500), "caption" character varying(255), "isApproved" boolean NOT NULL DEFAULT true, "approvedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_f855d3c717415b24d8e3ad64136" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d4b8a8df2f2a903d2f21b83688" ON "photo_wall" ("weddingId", "isApproved") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_channel_enum" AS ENUM('zalo', 'sms', 'email')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_type_enum" AS ENUM('invite', 'reminder', 'thank_you', 'rsvp_confirm')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_status_enum" AS ENUM('pending', 'sent', 'failed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "weddingId" uuid NOT NULL, "guestId" uuid, "channel" "public"."notifications_channel_enum" NOT NULL, "type" "public"."notifications_type_enum" NOT NULL, "subject" character varying(255), "content" text NOT NULL, "status" "public"."notifications_status_enum" NOT NULL DEFAULT 'pending', "scheduledAt" TIMESTAMP WITH TIME ZONE NOT NULL, "sentAt" TIMESTAMP WITH TIME ZONE, "failedReason" text, "provider" character varying(50), "providerMsgId" character varying(255), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_54e1725163ede8bf2ce08874a6" ON "notifications" ("guestId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ab221329a9f4c2111690d52f34" ON "notifications" ("scheduledAt", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5cda9f299594e9c9aafff3e081" ON "notifications" ("weddingId", "status") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guests_side_enum" AS ENUM('groom', 'bride', 'both')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guests_rsvpstatus_enum" AS ENUM('pending', 'attending', 'declined')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."guests_dietary_enum" AS ENUM('normal', 'vegetarian', 'halal', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "guests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "weddingId" uuid NOT NULL, "groupId" uuid, "tableId" uuid, "fullName" character varying(100) NOT NULL, "phone" character varying(20), "email" character varying(255), "salutation" character varying(20), "side" "public"."guests_side_enum" NOT NULL DEFAULT 'both', "isVip" boolean NOT NULL DEFAULT false, "invitationCode" character varying(32) NOT NULL, "qrCodeUrl" text, "rsvpStatus" "public"."guests_rsvpstatus_enum" NOT NULL DEFAULT 'pending', "attendingCount" smallint NOT NULL DEFAULT '1', "dietary" "public"."guests_dietary_enum" NOT NULL DEFAULT 'normal', "dietaryNote" character varying(255), "needsTransport" boolean NOT NULL DEFAULT false, "rsvpNote" text, "rsvpAt" TIMESTAMP WITH TIME ZONE, "invitedAt" TIMESTAMP WITH TIME ZONE, "invitationViewedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_47425d181c5b741f25e948e37d5" UNIQUE ("invitationCode"), CONSTRAINT "PK_4948267e93869ddcc6b340a2c46" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a5b20de625c0876218eb3c4743" ON "guests" ("weddingId", "tableId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_98a1b6028433512c2550428a36" ON "guests" ("weddingId", "rsvpStatus") `,
    );
    await queryRunner.query(
      `CREATE TABLE "guest_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "weddingId" uuid NOT NULL, "name" character varying(100) NOT NULL, "colorLabel" character varying(7), "description" character varying(255), "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_4fbeadf123f31f44b0be0c5414e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a2ec77094b9d7fbbfba88addbd" ON "guest_groups" ("weddingId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "userId" character varying(36) NOT NULL, "code" character varying(50), "fullName" character varying(100) NOT NULL, "email" character varying(255), "phone" character varying(20), "gender" character varying(20), "dateOfBirth" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ai_suggestions_targetgroup_enum" AS ENUM('family', 'friend', 'colleague', 'general')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ai_suggestions_tone_enum" AS ENUM('formal', 'warm', 'fun', 'poetic')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ai_suggestions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "weddingId" uuid NOT NULL, "targetGroup" "public"."ai_suggestions_targetgroup_enum" NOT NULL, "tone" "public"."ai_suggestions_tone_enum" NOT NULL, "language" character varying(5) NOT NULL DEFAULT 'vi', "customPrompt" text, "generatedText" text NOT NULL, "modelUsed" character varying(50), "tokensUsed" integer, "isUsed" boolean NOT NULL DEFAULT false, "usedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5c769622a5d4b1e17e34983f75d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c0319aa0e24c8d0b9d1772e37a" ON "ai_suggestions" ("weddingId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "action-logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "createdById" uuid NOT NULL, "createdByCode" character varying(255) NOT NULL, "createdByName" character varying(255) NOT NULL, "createdNote" text, "actionType" character varying(255), "entityId" uuid, "entityName" character varying(255), "oldValue" jsonb, "newValue" jsonb, "ipAddress" character varying(255), "userAgent" text, "location" character varying(255), CONSTRAINT "PK_ffb219d8978756f5e8cfd9e7efe" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "action-logs"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c0319aa0e24c8d0b9d1772e37a"`,
    );
    await queryRunner.query(`DROP TABLE "ai_suggestions"`);
    await queryRunner.query(`DROP TYPE "public"."ai_suggestions_tone_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."ai_suggestions_targetgroup_enum"`,
    );
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a2ec77094b9d7fbbfba88addbd"`,
    );
    await queryRunner.query(`DROP TABLE "guest_groups"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_98a1b6028433512c2550428a36"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a5b20de625c0876218eb3c4743"`,
    );
    await queryRunner.query(`DROP TABLE "guests"`);
    await queryRunner.query(`DROP TYPE "public"."guests_dietary_enum"`);
    await queryRunner.query(`DROP TYPE "public"."guests_rsvpstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."guests_side_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5cda9f299594e9c9aafff3e081"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ab221329a9f4c2111690d52f34"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_54e1725163ede8bf2ce08874a6"`,
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_channel_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d4b8a8df2f2a903d2f21b83688"`,
    );
    await queryRunner.query(`DROP TABLE "photo_wall"`);
    await queryRunner.query(`DROP TABLE "service_plans"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_df76e81987c46fdacee7c6dcdc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_466cb9605c1638a4870e32344d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fbdba4e2ac694cf8c9cecf4dc8"`,
    );
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TYPE "public"."subscriptions_status_enum"`);
    await queryRunner.query(`DROP TABLE "system-configs"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d0988b541d054a5913ba7e4fac"`,
    );
    await queryRunner.query(`DROP TABLE "tables"`);
    await queryRunner.query(`DROP TABLE "user_tokens"`);
    await queryRunner.query(`DROP TABLE "templates"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "verify_otps"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0ca00a09434bbefb8d85fa2b05"`,
    );
    await queryRunner.query(`DROP TABLE "wedding_photos"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4973f8ebed8ca01d043702b330"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a19a4ab35aebe81eb108ae24ed"`,
    );
    await queryRunner.query(`DROP TABLE "weddings"`);
    await queryRunner.query(`DROP TYPE "public"."weddings_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."weddings_musictype_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8894238eb957015349a374b0b9"`,
    );
    await queryRunner.query(`DROP TABLE "wishes"`);
  }
}
