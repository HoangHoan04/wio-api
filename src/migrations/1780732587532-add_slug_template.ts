import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSlugTemplate1780732587532 implements MigrationInterface {
  name = 'AddSlugTemplate1780732587532';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "slug" character varying(100)`,
    );

    await queryRunner.query(`
      UPDATE "templates"
      SET "slug" = LOWER(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            TRIM("name"), 
            '[^a-zA-Z0-9\\s-]', '', 'g' -- Xóa ký tự đặc biệt
          ), 
          '\\s+', '-', 'g' -- Thay khoảng trắng bằng dấu gạch ngang
        )
      ) || '-' || SUBSTRING(id::text, 1, 8)
      WHERE "slug" IS NULL;
    `);

    await queryRunner.query(
      `ALTER TABLE "templates" ALTER COLUMN "slug" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ADD CONSTRAINT "UQ_996873c57c54937eba59605def3" UNIQUE ("slug")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "templates" DROP CONSTRAINT "UQ_996873c57c54937eba59605def3"`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "slug"`);
  }
}
