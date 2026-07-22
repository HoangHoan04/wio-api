import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTemplateServicePlan1784703020873 implements MigrationInterface {
    name = 'ChangeTemplateServicePlan1784703020873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "templates" RENAME COLUMN "minPlan" TO "min_plan_id"`);
        await queryRunner.query(`CREATE TABLE "contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(50), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "phone" character varying(50), "subject" character varying(255), "message" text NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'PENDING', "admin_note" text, "responded_at" TIMESTAMP, "responded_by" character varying(36), "created_by_id" character varying(36), CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "min_plan_id"`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "min_plan_id" uuid`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "FK_c1e091ac12afc10334ed795688b" FOREIGN KEY ("min_plan_id") REFERENCES "service_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "FK_c1e091ac12afc10334ed795688b"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "min_plan_id"`);
        await queryRunner.query(`ALTER TABLE "templates" ADD "min_plan_id" character varying(20) NOT NULL DEFAULT 'free'`);
        await queryRunner.query(`DROP TABLE "contacts"`);
        await queryRunner.query(`ALTER TABLE "templates" RENAME COLUMN "min_plan_id" TO "minPlan"`);
    }

}
