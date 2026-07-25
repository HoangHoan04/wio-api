import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomDesignColumn1784947708186 implements MigrationInterface {
    name = 'AddCustomDesignColumn1784947708186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weddings" ADD "customDesign" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "customDesign"`);
    }

}
