import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationName1779785809707 implements MigrationInterface {
  name = 'MigrationName1779785809707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "slug_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "weddingId" uuid NOT NULL, "oldSlug" character varying(100) NOT NULL, "newSlug" character varying(100) NOT NULL, "changedBy" uuid NOT NULL, "reason" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8a2ec7e164f496a7b5ecd3bb335" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" ADD "shareUrl" text`);
    await queryRunner.query(`ALTER TABLE "weddings" ADD "shareQrUrl" text`);
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "minPlan" character varying(20) NOT NULL DEFAULT 'free'`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP CONSTRAINT "UQ_1205c1b99fdfea139487f672455"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_wedding_slug" ON "weddings" ("slug") WHERE "status" != 'archived' AND "isDeleted" = false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."UQ_wedding_slug"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD CONSTRAINT "UQ_1205c1b99fdfea139487f672455" UNIQUE ("slug")`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "minPlan"`);
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "shareQrUrl"`);
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "shareUrl"`);
    await queryRunner.query(`DROP TABLE "slug_history"`);
  }
}
