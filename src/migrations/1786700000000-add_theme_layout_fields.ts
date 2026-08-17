import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddThemeLayoutFields1786700000000 implements MigrationInterface {
  name = 'AddThemeLayoutFields1786700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "themeLayout" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "presetLayout" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "presetTokens" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitations" ADD "presetLayoutOverride" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invitations" DROP COLUMN "presetLayoutOverride"`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "presetTokens"`);
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "presetLayout"`);
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "themeLayout"`);
  }
}
