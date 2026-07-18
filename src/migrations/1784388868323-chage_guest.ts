import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChageGuest1784388868323 implements MigrationInterface {
  name = 'ChageGuest1784388868323';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "dietaryNote"`);
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "dietary"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_wedding_slug" ON "weddings" ("slug") WHERE "status" != 'ARCHIVED' AND "isDeleted" = false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."UQ_wedding_slug"`);
    await queryRunner.query(
      `ALTER TABLE "guests" ADD "dietary" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ADD "dietaryNote" character varying(255)`,
    );
  }
}
