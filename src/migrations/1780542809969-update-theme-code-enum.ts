import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateThemeCodeEnum1780542809969 implements MigrationInterface {
  name = 'UpdateThemeCodeEnum1780542809969';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "templates" DROP CONSTRAINT "UQ_8b09664b07616489406bd33adfb"`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "themeCode"`);
    await queryRunner.query(
      `CREATE TYPE "public"."templates_themecode_enum" AS ENUM('MODERN_DARK', 'HONGKONG_CLASSIC', 'FLORAL_VINTAGE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "themeCode" "public"."templates_themecode_enum" NOT NULL DEFAULT 'MODERN_DARK'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "themeCode"`);
    await queryRunner.query(`DROP TYPE "public"."templates_themecode_enum"`);
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "themeCode" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ADD CONSTRAINT "UQ_8b09664b07616489406bd33adfb" UNIQUE ("themeCode")`,
    );
  }
}
