import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTemplateViewCounts1784704582634 implements MigrationInterface {
    name = 'AddTemplateViewCounts1784704582634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "templates" ADD "viewCount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "previewCount" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "previewCount"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "viewCount"`);
    }

}
