import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeGuestEnttiy1784393285006 implements MigrationInterface {
  name = 'ChangeGuestEnttiy1784393285006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guests" DROP CONSTRAINT "FK_f52db5017ebcff092698d22ea0c"`,
    );
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "groupId"`);
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "email"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "guests" ADD "email" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ADD "phone" character varying(20)`,
    );
    await queryRunner.query(`ALTER TABLE "guests" ADD "groupId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "guests" ADD CONSTRAINT "FK_f52db5017ebcff092698d22ea0c" FOREIGN KEY ("groupId") REFERENCES "guest_groups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
