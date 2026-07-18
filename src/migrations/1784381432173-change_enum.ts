import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeEnum1784381432173 implements MigrationInterface {
  name = 'ChangeEnum1784381432173';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Xóa tất cả các Index cũ liên quan trước để tránh khóa ràng buộc
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_98a1b6028433512c2550428a36"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_4973f8ebed8ca01d043702b330"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_df76e81987c46fdacee7c6dcdc"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_ab221329a9f4c2111690d52f34"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_5cda9f299594e9c9aafff3e081"`,
    );

    // ==========================================
    // 1. XỬ LÝ BẢNG GUESTS
    // ==========================================
    // Tạo cột tạm
    await queryRunner.query(
      `ALTER TABLE "guests" ADD "side_temp" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ADD "rsvpStatus_temp" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ADD "dietary_temp" character varying(20)`,
    );
    // Copy + Chuẩn hóa dữ liệu sang chữ hoa
    await queryRunner.query(
      `UPDATE "guests" SET "side_temp" = UPPER("side"::text), "rsvpStatus_temp" = UPPER("rsvpStatus"::text), "dietary_temp" = UPPER("dietary"::text)`,
    );
    // Đổ giá trị fallback nếu dính null trước khi gắn NOT NULL
    await queryRunner.query(
      `UPDATE "guests" SET "side_temp" = 'BOTH' WHERE "side_temp" IS NULL`,
    );
    await queryRunner.query(
      `UPDATE "guests" SET "rsvpStatus_temp" = 'PENDING' WHERE "rsvpStatus_temp" IS NULL`,
    );
    await queryRunner.query(
      `UPDATE "guests" SET "dietary_temp" = 'NORMAL' WHERE "dietary_temp" IS NULL`,
    );
    // Gắn ràng buộc NOT NULL
    await queryRunner.query(
      `ALTER TABLE "guests" ALTER COLUMN "side_temp" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ALTER COLUMN "rsvpStatus_temp" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ALTER COLUMN "dietary_temp" SET NOT NULL`,
    );
    // Xóa cột cũ và đổi tên cột tạm
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "side"`);
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "rsvpStatus"`);
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "dietary"`);
    await queryRunner.query(
      `ALTER TABLE "guests" RENAME COLUMN "side_temp" TO "side"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" RENAME COLUMN "rsvpStatus_temp" TO "rsvpStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" RENAME COLUMN "dietary_temp" TO "dietary"`,
    );
    // Xóa ENUM cũ khỏi DB
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."guests_side_enum"`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."guests_rsvpstatus_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."guests_dietary_enum"`,
    );

    // ==========================================
    // 2. XỬ LÝ BẢNG USERS
    // ==========================================
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role_temp" character varying(20)`,
    );
    await queryRunner.query(
      `UPDATE "users" SET "role_temp" = UPPER("role"::text)`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "role_temp" TO "role"`,
    );
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_role_enum"`);

    // ==========================================
    // 3. XỬ LÝ BẢNG WEDDINGS
    // ==========================================
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "musicType_temp" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "status_temp" character varying(50)`,
    );
    await queryRunner.query(
      `UPDATE "weddings" SET "musicType_temp" = UPPER("musicType"::text), "status_temp" = UPPER("status"::text)`,
    );
    await queryRunner.query(
      `UPDATE "weddings" SET "status_temp" = 'DRAFT' WHERE "status_temp" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ALTER COLUMN "status_temp" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "musicType"`);
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" RENAME COLUMN "musicType_temp" TO "musicType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" RENAME COLUMN "status_temp" TO "status"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."weddings_musictype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."weddings_status_enum"`,
    );

    // ==========================================
    // 4. XỬ LÝ BẢNG SUBSCRIPTIONS
    // ==========================================
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "status_temp" character varying(255)`,
    );
    await queryRunner.query(
      `UPDATE "subscriptions" SET "status_temp" = UPPER("status"::text)`,
    );
    await queryRunner.query(
      `UPDATE "subscriptions" SET "status_temp" = 'ACTIVE' WHERE "status_temp" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ALTER COLUMN "status_temp" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "subscriptions" RENAME COLUMN "status_temp" TO "status"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."subscriptions_status_enum"`,
    );

    // ==========================================
    // 5. XỬ LÝ BẢNG NOTIFICATIONS
    // ==========================================
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "channel_temp" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "type_temp" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "status_temp" character varying(255)`,
    );
    await queryRunner.query(
      `UPDATE "notifications" SET "channel_temp" = UPPER("channel"::text), "type_temp" = UPPER("type"::text), "status_temp" = UPPER("status"::text)`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "channel_temp" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "type_temp" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "status_temp" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "channel"`,
    );
    await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "notifications" RENAME COLUMN "channel_temp" TO "channel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" RENAME COLUMN "type_temp" TO "type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" RENAME COLUMN "status_temp" TO "status"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."notifications_channel_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."notifications_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."notifications_status_enum"`,
    );

    // ==========================================
    // 6. XỬ LÝ BẢNG MUSIC BACKGROUNDS
    // ==========================================
    await queryRunner.query(
      `ALTER TABLE "music_backgrounds" ADD "status_temp" character varying(20)`,
    );
    await queryRunner.query(
      `UPDATE "music_backgrounds" SET "status_temp" = UPPER("status"::text)`,
    );
    await queryRunner.query(
      `ALTER TABLE "music_backgrounds" ALTER COLUMN "status_temp" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "music_backgrounds" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "music_backgrounds" RENAME COLUMN "status_temp" TO "status"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."music_backgrounds_status_enum"`,
    );

    // ==========================================
    // TÁI TẠO LẠI TOÀN BỘ CÁC CỦA INDEX
    // ==========================================
    await queryRunner.query(
      `CREATE INDEX "IDX_98a1b6028433512c2550428a36" ON "guests" ("weddingId", "rsvpStatus")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4973f8ebed8ca01d043702b330" ON "weddings" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df76e81987c46fdacee7c6dcdc" ON "subscriptions" ("status", "expiresAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ab221329a9f4c2111690d52f34" ON "notifications" ("scheduledAt", "status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5cda9f299594e9c9aafff3e081" ON "notifications" ("weddingId", "status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Phần hàm down giữ nguyên để rollback về cấu trúc cũ khi cần thiết
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_5cda9f299594e9c9aafff3e081"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_ab221329a9f4c2111690d52f34"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_df76e81987c46fdacee7c6dcdc"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_4973f8ebed8ca01d043702b330"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_98a1b6028433512c2550428a36"`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."music_backgrounds_status_enum" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "music_backgrounds" ALTER COLUMN "status" TYPE "public"."music_backgrounds_status_enum" USING "status"::"public"."music_backgrounds_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "music_backgrounds" ALTER COLUMN "status" SET DEFAULT 'COMPLETED'`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."notifications_status_enum" AS ENUM('pending', 'sent', 'failed', 'cancelled')`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "status" TYPE "public"."notifications_status_enum" USING LOWER("status")::"public"."notifications_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."notifications_type_enum" AS ENUM('invite', 'reminder', 'thank_you', 'rsvp_confirm')`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "public"."notifications_type_enum" USING LOWER("type")::"public"."notifications_type_enum"`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."notifications_channel_enum" AS ENUM('zalo', 'sms', 'email')`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "channel" TYPE "public"."notifications_channel_enum" USING LOWER("channel")::"public"."notifications_channel_enum"`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."subscriptions_status_enum" AS ENUM('active', 'expired', 'cancelled')`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ALTER COLUMN "status" TYPE "public"."subscriptions_status_enum" USING LOWER("status")::"public"."subscriptions_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DEFAULT 'active'`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."weddings_status_enum" AS ENUM('draft', 'published', 'archived')`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ALTER COLUMN "status" TYPE "public"."weddings_status_enum" USING LOWER("status")::"public"."weddings_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ALTER COLUMN "status" SET DEFAULT 'draft'`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."weddings_musictype_enum" AS ENUM('upload', 'youtube', 'spotify')`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ALTER COLUMN "musicType" TYPE "public"."weddings_musictype_enum" USING LOWER("musicType")::"public"."weddings_musictype_enum"`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('couple', 'admin')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING LOWER("role")::"public"."users_role_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'couple'`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."guests_dietary_enum" AS ENUM('normal', 'vegetarian', 'halal', 'other')`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ALTER COLUMN "dietary" TYPE "public"."guests_dietary_enum" USING LOWER("dietary")::"public"."guests_dietary_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ALTER COLUMN "dietary" SET DEFAULT 'normal'`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."guests_rsvpstatus_enum" AS ENUM('pending', 'attending', 'declined')`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ALTER COLUMN "rsvpStatus" TYPE "public"."guests_rsvpstatus_enum" USING LOWER("rsvpStatus")::"public"."guests_rsvpstatus_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ALTER COLUMN "rsvpStatus" SET DEFAULT 'pending'`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."guests_side_enum" AS ENUM('groom', 'bride', 'both')`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ALTER COLUMN "side" TYPE "public"."guests_side_enum" USING LOWER("side")::"public"."guests_side_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ALTER COLUMN "side" SET DEFAULT 'both'`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_5cda9f299594e9c9aafff3e081" ON "notifications" ("status", "weddingId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ab221329a9f4c2111690d52f34" ON "notifications" ("scheduledAt", "status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df76e81987c46fdacee7c6dcdc" ON "subscriptions" ("expiresAt", "status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4973f8ebed8ca01d043702b330" ON "weddings" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_98a1b6028433512c2550428a36" ON "guests" ("rsvpStatus", "weddingId")`,
    );
  }
}
