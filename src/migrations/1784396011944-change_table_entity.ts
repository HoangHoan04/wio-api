import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTableEntity1784396011944 implements MigrationInterface {
  name = 'ChangeTableEntity1784396011944';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tables" ALTER COLUMN "currentSeats" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tables" ALTER COLUMN "currentSeats" SET NOT NULL`,
    );
  }
}
