import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeMusicBackground1784877753277 implements MigrationInterface {
    name = 'AddTypeMusicBackground1784877753277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "music_backgrounds" ADD "type" character varying(20) NOT NULL DEFAULT 'admin'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "music_backgrounds" DROP COLUMN "type"`);
    }

}
