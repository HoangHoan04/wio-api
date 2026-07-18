import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMusicBackground1780598158465 implements MigrationInterface {
  name = 'AddMusicBackground1780598158465';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."music_backgrounds_status_enum" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "music_backgrounds" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying(255) NOT NULL, "author" character varying(255), "duration" character varying(50), "usageCount" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "status" "public"."music_backgrounds_status_enum" NOT NULL DEFAULT 'COMPLETED', "youtubeUrl" text, "audioUrl" text, CONSTRAINT "PK_9715fb49ec7050470fb1521db7b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "music_backgrounds"`);
    await queryRunner.query(
      `DROP TYPE "public"."music_backgrounds_status_enum"`,
    );
  }
}
