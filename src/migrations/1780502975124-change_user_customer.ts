import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserCustomer1780502975124 implements MigrationInterface {
  name = 'ChangeUserCustomer1780502975124';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "passwordHash" TO "password"`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`,
    );

    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullName"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "customerId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_c6c520dfb9a4d6dd749e73b13de" UNIQUE ("customerId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "isAdmin" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD "lastLogin" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_c6c520dfb9a4d6dd749e73b13de" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_c6c520dfb9a4d6dd749e73b13de"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastLogin"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isAdmin"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_c6c520dfb9a4d6dd749e73b13de"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "customerId"`);

    await queryRunner.query(
      `UPDATE "users" SET "password" = 'temp_fallback_password' WHERE "password" IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "password" TO "passwordHash"`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" ADD "fullName" character varying(100) NOT NULL`,
    );
  }
}
