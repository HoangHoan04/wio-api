import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWeddingInfo1780676997623 implements MigrationInterface {
  name = 'AddWeddingInfo1780676997623';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "groomFamilyTitle" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "brideFamilyTitle" character varying(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "brideFamilyTitle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "groomFamilyTitle"`,
    );
  }
}
