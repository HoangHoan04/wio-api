import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlignInvitationContract1789651865000 implements MigrationInterface {
  name = 'AlignInvitationContract1789651865000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "createdVia" character varying(30) NOT NULL DEFAULT 'TEMPLATE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "themeSnapshot" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "designSchemaVersion" integer NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "currentVersionId" uuid`,
    );

    await queryRunner.query(
      `ALTER TABLE "templates" ADD COLUMN IF NOT EXISTS "kind" character varying(30) NOT NULL DEFAULT 'CODE_THEME'`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ADD COLUMN IF NOT EXISTS "canvasPreset" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ADD COLUMN IF NOT EXISTS "version" integer NOT NULL DEFAULT 1`,
    );

    await queryRunner.query(
      `ALTER TABLE "guests" ADD COLUMN IF NOT EXISTS "phone" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ADD COLUMN IF NOT EXISTS "email" character varying(255)`,
    );

    await queryRunner.query(
      `ALTER TABLE "tables" ADD COLUMN IF NOT EXISTS "shape" character varying(20)`,
    );

    await queryRunner.query(
      `ALTER TABLE "invitation_gifts" ADD COLUMN IF NOT EXISTS "bankBin" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_gifts" ADD COLUMN IF NOT EXISTS "isVisible" boolean NOT NULL DEFAULT true`,
    );

    await queryRunner.query(
      `ALTER TABLE "service_plans" ADD COLUMN IF NOT EXISTS "maxAiScans" integer NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_plans" ADD COLUMN IF NOT EXISTS "maxCanvasPages" integer NOT NULL DEFAULT 1`,
    );

    await queryRunner.query(
      `ALTER TABLE "stock_assets" ADD COLUMN IF NOT EXISTS "width" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock_assets" ADD COLUMN IF NOT EXISTS "height" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock_assets" ADD COLUMN IF NOT EXISTS "mimeType" character varying(80)`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock_assets" ADD COLUMN IF NOT EXISTS "isPremium" boolean NOT NULL DEFAULT false`,
    );

    await queryRunner.query(
      `ALTER TABLE "ai_scan_jobs" ALTER COLUMN "invitationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ai_scan_jobs" ADD COLUMN IF NOT EXISTS "extractedContent" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "ai_scan_jobs" ADD COLUMN IF NOT EXISTS "reconstructedDesign" jsonb`,
    );

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "invitations"
          ADD CONSTRAINT "FK_invitations_musicId"
          FOREIGN KEY ("musicId") REFERENCES "music_backgrounds"("id")
          ON DELETE SET NULL;
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "invitation_timelines"
          ADD CONSTRAINT "FK_invitation_timelines_eventId"
          FOREIGN KEY ("eventId") REFERENCES "invitation_events"("id")
          ON DELETE SET NULL;
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invitation_timelines" DROP CONSTRAINT IF EXISTS "FK_invitation_timelines_eventId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" DROP CONSTRAINT IF EXISTS "FK_invitations_musicId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ai_scan_jobs" DROP COLUMN IF EXISTS "reconstructedDesign"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ai_scan_jobs" DROP COLUMN IF EXISTS "extractedContent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ai_scan_jobs" ALTER COLUMN "invitationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock_assets" DROP COLUMN IF EXISTS "isPremium"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock_assets" DROP COLUMN IF EXISTS "mimeType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock_assets" DROP COLUMN IF EXISTS "height"`,
    );
    await queryRunner.query(
      `ALTER TABLE "stock_assets" DROP COLUMN IF EXISTS "width"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_plans" DROP COLUMN IF EXISTS "maxCanvasPages"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_plans" DROP COLUMN IF EXISTS "maxAiScans"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_gifts" DROP COLUMN IF EXISTS "isVisible"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_gifts" DROP COLUMN IF EXISTS "bankBin"`,
    );
    await queryRunner.query(`ALTER TABLE "tables" DROP COLUMN IF EXISTS "shape"`);
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN IF EXISTS "email"`);
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN IF EXISTS "phone"`);
    await queryRunner.query(
      `ALTER TABLE "templates" DROP COLUMN IF EXISTS "version"`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" DROP COLUMN IF EXISTS "canvasPreset"`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN IF EXISTS "kind"`);
    await queryRunner.query(
      `ALTER TABLE "invitations" DROP COLUMN IF EXISTS "currentVersionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" DROP COLUMN IF EXISTS "designSchemaVersion"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" DROP COLUMN IF EXISTS "themeSnapshot"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" DROP COLUMN IF EXISTS "createdVia"`,
    );
  }
}
