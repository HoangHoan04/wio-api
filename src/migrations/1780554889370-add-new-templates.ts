import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewTemplates1780554889370 implements MigrationInterface {
  name = 'AddNewTemplates1780554889370';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."templates_themecode_enum" RENAME TO "templates_themecode_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."templates_themecode_enum" AS ENUM('MODERN_DARK', 'HONGKONG_CLASSIC', 'FLORAL_VINTAGE', 'MINIMAL_ELEGANCE', 'RUSTIC_CHARM', 'OCEAN_BREEZE', 'ROYAL_GOLD', 'AUTUMN_LEAVES', 'SPRING_BLOSSOM', 'URBAN_CHIC', 'CLASSIC_ROMANCE', 'BOHEMIAN_DREAM', 'STARRY_NIGHT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ALTER COLUMN "themeCode" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ALTER COLUMN "themeCode" TYPE "public"."templates_themecode_enum" USING "themeCode"::"text"::"public"."templates_themecode_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ALTER COLUMN "themeCode" SET DEFAULT 'MODERN_DARK'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."templates_themecode_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."templates_themecode_enum_old" AS ENUM('MODERN_DARK', 'HONGKONG_CLASSIC', 'FLORAL_VINTAGE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ALTER COLUMN "themeCode" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ALTER COLUMN "themeCode" TYPE "public"."templates_themecode_enum_old" USING "themeCode"::"text"::"public"."templates_themecode_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ALTER COLUMN "themeCode" SET DEFAULT 'MODERN_DARK'`,
    );
    await queryRunner.query(`DROP TYPE "public"."templates_themecode_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."templates_themecode_enum_old" RENAME TO "templates_themecode_enum"`,
    );
  }
}
