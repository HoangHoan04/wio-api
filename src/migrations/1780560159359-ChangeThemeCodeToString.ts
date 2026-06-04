import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeThemeCodeToString1780560159359 implements MigrationInterface {
  name = 'ChangeThemeCodeToString1780560159359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "themeCode"`);
    await queryRunner.query(`DROP TYPE "public"."templates_themecode_enum"`);
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "themeCode" character varying(100) NOT NULL DEFAULT 'BOHO_FLORAL_BROWN'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "themeCode"`);
    await queryRunner.query(
      `CREATE TYPE "public"."templates_themecode_enum" AS ENUM('MODERN_DARK', 'HONGKONG_CLASSIC', 'FLORAL_VINTAGE', 'MINIMAL_ELEGANCE', 'RUSTIC_CHARM', 'OCEAN_BREEZE', 'ROYAL_GOLD', 'AUTUMN_LEAVES', 'SPRING_BLOSSOM', 'URBAN_CHIC', 'CLASSIC_ROMANCE', 'BOHEMIAN_DREAM', 'STARRY_NIGHT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "themeCode" "public"."templates_themecode_enum" NOT NULL DEFAULT 'MODERN_DARK'`,
    );
  }
}
