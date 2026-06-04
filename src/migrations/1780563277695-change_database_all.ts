import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDatabaseAll1780563277695 implements MigrationInterface {
  name = 'ChangeDatabaseAll1780563277695';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_c6c520dfb9a4d6dd749e73b13de"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0ca00a09434bbefb8d85fa2b05"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a2ec77094b9d7fbbfba88addbd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d0988b541d054a5913ba7e4fac"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fbdba4e2ac694cf8c9cecf4dc8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_466cb9605c1638a4870e32344d"`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "isActive"`);
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "sortOrder"`);
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "previewUrl"`);
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "description" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "templates" ADD "tags" text`);
    await queryRunner.query(`ALTER TABLE "templates" ADD "features" json`);
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "isShow" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "trialDays" integer NOT NULL DEFAULT '3'`,
    );
    await queryRunner.query(`ALTER TABLE "slug_history" ADD "createdBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "slug_history" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "slug_history" ADD "updatedBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "slug_history" ADD "isDeleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "createdBy"`);
    await queryRunner.query(`ALTER TABLE "customers" ADD "createdBy" uuid`);
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "updatedBy"`);
    await queryRunner.query(`ALTER TABLE "customers" ADD "updatedBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "customers" ALTER COLUMN "userId" TYPE uuid USING "userId"::uuid`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdBy"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "createdBy" uuid`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedBy"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "updatedBy" uuid`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastLogin"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "lastLogin" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "createdBy"`);
    await queryRunner.query(`ALTER TABLE "templates" ADD "createdBy" uuid`);
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "updatedBy"`);
    await queryRunner.query(`ALTER TABLE "templates" ADD "updatedBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "templates" ALTER COLUMN "themeCode" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "wishes" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "wishes" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "wishes" DROP COLUMN "createdBy"`);
    await queryRunner.query(`ALTER TABLE "wishes" ADD "createdBy" uuid`);
    await queryRunner.query(`ALTER TABLE "wishes" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "wishes" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "wishes" DROP COLUMN "updatedBy"`);
    await queryRunner.query(`ALTER TABLE "wishes" ADD "updatedBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" ADD "createdBy" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" ADD "updatedBy" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(`ALTER TABLE "guest_groups" ADD "createdBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "guest_groups" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(`ALTER TABLE "guest_groups" ADD "updatedBy" uuid`);
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "guests" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "createdBy"`);
    await queryRunner.query(`ALTER TABLE "guests" ADD "createdBy" uuid`);
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "guests" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "updatedBy"`);
    await queryRunner.query(`ALTER TABLE "guests" ADD "updatedBy" uuid`);
    await queryRunner.query(`ALTER TABLE "tables" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "tables" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "tables" DROP COLUMN "createdBy"`);
    await queryRunner.query(`ALTER TABLE "tables" ADD "createdBy" uuid`);
    await queryRunner.query(`ALTER TABLE "tables" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "tables" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "tables" DROP COLUMN "updatedBy"`);
    await queryRunner.query(`ALTER TABLE "tables" ADD "updatedBy" uuid`);
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "createdBy"`);
    await queryRunner.query(`ALTER TABLE "weddings" ADD "createdBy" uuid`);
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "updatedBy"`);
    await queryRunner.query(`ALTER TABLE "weddings" ADD "updatedBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "verify_otps" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verify_otps" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "verify_otps" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(`ALTER TABLE "verify_otps" ADD "createdBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "verify_otps" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verify_otps" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "verify_otps" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(`ALTER TABLE "verify_otps" ADD "updatedBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user_tokens" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(`ALTER TABLE "user_tokens" ADD "createdBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user_tokens" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(`ALTER TABLE "user_tokens" ADD "updatedBy" uuid`);
    await queryRunner.query(`ALTER TABLE "user_tokens" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "user_tokens" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "service_plans" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_plans" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_plans" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(`ALTER TABLE "service_plans" ADD "createdBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "service_plans" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_plans" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_plans" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(`ALTER TABLE "service_plans" ADD "updatedBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(`ALTER TABLE "subscriptions" ADD "createdBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(`ALTER TABLE "subscriptions" ADD "updatedBy" uuid`);
    await queryRunner.query(`ALTER TABLE "photo_wall" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "photo_wall" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "photo_wall" DROP COLUMN "createdBy"`);
    await queryRunner.query(`ALTER TABLE "photo_wall" ADD "createdBy" uuid`);
    await queryRunner.query(`ALTER TABLE "photo_wall" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "photo_wall" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "photo_wall" DROP COLUMN "updatedBy"`);
    await queryRunner.query(`ALTER TABLE "photo_wall" ADD "updatedBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(`ALTER TABLE "notifications" ADD "createdBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(`ALTER TABLE "notifications" ADD "updatedBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "action-logs" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "action-logs" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "action-logs" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(`ALTER TABLE "action-logs" ADD "createdBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "action-logs" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "action-logs" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "action-logs" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(`ALTER TABLE "action-logs" ADD "updatedBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_c6c520dfb9a4d6dd749e73b13de" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishes" ADD CONSTRAINT "FK_efeb87e6c1676b784a4eb05c0fa" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" ADD CONSTRAINT "FK_0ca00a09434bbefb8d85fa2b058" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" ADD CONSTRAINT "FK_a2ec77094b9d7fbbfba88addbd9" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ADD CONSTRAINT "FK_26a1751a4fed39d12cb854a8711" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ADD CONSTRAINT "FK_6480f9e34b521067db2cd1bb9f9" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" ADD CONSTRAINT "FK_f52db5017ebcff092698d22ea0c" FOREIGN KEY ("groupId") REFERENCES "guest_groups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tables" ADD CONSTRAINT "FK_d0988b541d054a5913ba7e4facb" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD CONSTRAINT "FK_a19a4ab35aebe81eb108ae24ed0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD CONSTRAINT "FK_cd5728e57df28aae10b203a6450" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_466cb9605c1638a4870e32344d5" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_7536cba909dd7584a4640cad7d5" FOREIGN KEY ("planId") REFERENCES "service_plans"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "slug_history" ADD CONSTRAINT "FK_14f2986bb22179a29671474018f" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "photo_wall" ADD CONSTRAINT "FK_a3e96604e68db56d6cedf9b8dfb" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "photo_wall" DROP CONSTRAINT "FK_a3e96604e68db56d6cedf9b8dfb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "slug_history" DROP CONSTRAINT "FK_14f2986bb22179a29671474018f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_7536cba909dd7584a4640cad7d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_466cb9605c1638a4870e32344d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP CONSTRAINT "FK_cd5728e57df28aae10b203a6450"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP CONSTRAINT "FK_a19a4ab35aebe81eb108ae24ed0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tables" DROP CONSTRAINT "FK_d0988b541d054a5913ba7e4facb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" DROP CONSTRAINT "FK_f52db5017ebcff092698d22ea0c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" DROP CONSTRAINT "FK_6480f9e34b521067db2cd1bb9f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guests" DROP CONSTRAINT "FK_26a1751a4fed39d12cb854a8711"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" DROP CONSTRAINT "FK_a2ec77094b9d7fbbfba88addbd9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" DROP CONSTRAINT "FK_0ca00a09434bbefb8d85fa2b058"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishes" DROP CONSTRAINT "FK_efeb87e6c1676b784a4eb05c0fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_c6c520dfb9a4d6dd749e73b13de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "action-logs" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "action-logs" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(
      `ALTER TABLE "action-logs" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "action-logs" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "action-logs" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "action-logs" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "action-logs" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "action-logs" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "photo_wall" DROP COLUMN "updatedBy"`);
    await queryRunner.query(
      `ALTER TABLE "photo_wall" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(`ALTER TABLE "photo_wall" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "photo_wall" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "photo_wall" DROP COLUMN "createdBy"`);
    await queryRunner.query(
      `ALTER TABLE "photo_wall" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "photo_wall" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "photo_wall" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_plans" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_plans" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_plans" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_plans" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_plans" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_plans" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_plans" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_plans" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user_tokens" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "user_tokens" ADD "userId" character varying(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "verify_otps" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verify_otps" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(
      `ALTER TABLE "verify_otps" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verify_otps" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "verify_otps" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verify_otps" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "verify_otps" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "verify_otps" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "updatedBy"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "createdBy"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "tables" DROP COLUMN "updatedBy"`);
    await queryRunner.query(
      `ALTER TABLE "tables" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(`ALTER TABLE "tables" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "tables" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "tables" DROP COLUMN "createdBy"`);
    await queryRunner.query(
      `ALTER TABLE "tables" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "tables" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "tables" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "updatedBy"`);
    await queryRunner.query(
      `ALTER TABLE "guests" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "guests" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "createdBy"`);
    await queryRunner.query(
      `ALTER TABLE "guests" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "guests" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "guests" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "guest_groups" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_photos" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "wishes" DROP COLUMN "updatedBy"`);
    await queryRunner.query(
      `ALTER TABLE "wishes" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(`ALTER TABLE "wishes" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "wishes" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "wishes" DROP COLUMN "createdBy"`);
    await queryRunner.query(
      `ALTER TABLE "wishes" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "wishes" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "wishes" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ALTER COLUMN "themeCode" SET DEFAULT 'BOHO_FLORAL_BROWN'`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "updatedBy"`);
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "createdBy"`);
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastLogin"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "lastLogin" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedBy"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdBy"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ALTER COLUMN "userId" TYPE character varying(36)`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "updatedBy"`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "createdBy"`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "customers" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "slug_history" DROP COLUMN "isDeleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "slug_history" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "slug_history" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "slug_history" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "trialDays"`);
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "isShow"`);
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "features"`);
    await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "tags"`);
    await queryRunner.query(
      `ALTER TABLE "templates" DROP COLUMN "description"`,
    );
    await queryRunner.query(`ALTER TABLE "templates" ADD "previewUrl" text`);
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "sortOrder" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ADD "isActive" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_466cb9605c1638a4870e32344d" ON "subscriptions" ("weddingId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fbdba4e2ac694cf8c9cecf4dc8" ON "subscriptions" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d0988b541d054a5913ba7e4fac" ON "tables" ("weddingId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a2ec77094b9d7fbbfba88addbd" ON "guest_groups" ("weddingId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ca00a09434bbefb8d85fa2b05" ON "wedding_photos" ("weddingId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_c6c520dfb9a4d6dd749e73b13de" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
