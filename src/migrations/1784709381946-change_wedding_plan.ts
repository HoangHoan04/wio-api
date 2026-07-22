import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeWeddingPlan1784709381946 implements MigrationInterface {
    name = 'ChangeWeddingPlan1784709381946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_466cb9605c1638a4870e32344d5"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "weddingId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_466cb9605c1638a4870e32344d5" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_466cb9605c1638a4870e32344d5"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "weddingId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_466cb9605c1638a4870e32344d5" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
