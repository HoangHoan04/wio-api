import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBasePanelUtil1786641213492 implements MigrationInterface {
    name = 'AddBasePanelUtil1786641213492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stock_assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "title" character varying(150) NOT NULL, "category" character varying(40) NOT NULL, "tags" text, "src" text NOT NULL, "thumb" text, "kind" character varying(20) NOT NULL DEFAULT 'sticker', "license" character varying(120), "sortOrder" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_202a30cde62fa6ab0f74aaadc1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1c84c3e7cdd37d56bb4bef7c21" ON "stock_assets" ("category") `);
        await queryRunner.query(`CREATE INDEX "IDX_d2093e81ee39b2202416b3d409" ON "stock_assets" ("kind") `);
        await queryRunner.query(`CREATE INDEX "IDX_stock_asset_kind_active" ON "stock_assets" ("kind", "isActive", "sortOrder") `);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "authorName" character varying(150) NOT NULL, "content" text NOT NULL, "rating" smallint NOT NULL, "eventLabel" character varying(150), "avatarUrl" text, "cardType" character varying(40), "invitationId" uuid, "userId" uuid, "status" character varying(20) NOT NULL DEFAULT 'PENDING', "isPinned" boolean NOT NULL DEFAULT false, "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7998143b53b0743178739b02fe" ON "reviews" ("invitationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7b06c23cf52ca8aea0dcaf0ee2" ON "reviews" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_review_status_pinned" ON "reviews" ("status", "isPinned", "sortOrder") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_review_status_pinned"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7b06c23cf52ca8aea0dcaf0ee2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7998143b53b0743178739b02fe"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_stock_asset_kind_active"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d2093e81ee39b2202416b3d409"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c84c3e7cdd37d56bb4bef7c21"`);
        await queryRunner.query(`DROP TABLE "stock_assets"`);
    }

}
