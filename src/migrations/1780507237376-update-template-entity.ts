import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTemplateEntity1780507237376 implements MigrationInterface {
  name = 'UpdateTemplateEntity1780507237376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "templates" RENAME COLUMN "cssConfig" TO "themeCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "themeCode"`);
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "themeCode" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ADD CONSTRAINT "UQ_8b09664b07616489406bd33adfb" UNIQUE ("themeCode")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "templates" DROP CONSTRAINT "UQ_8b09664b07616489406bd33adfb"`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "themeCode"`);
    await queryRunner.query(`ALTER TABLE "templates" ADD "themeCode" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" RENAME COLUMN "themeCode" TO "cssConfig"`,
    );
  }
}
