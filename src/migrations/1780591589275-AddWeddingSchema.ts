import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWeddingSchema1780591589275 implements MigrationInterface {
  name = 'AddWeddingSchema1780591589275';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wedding_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "weddingId" uuid NOT NULL, "title" character varying(255) NOT NULL, "date" character varying(50), "time" character varying(50), "address" text, "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_c483ff9ca74fbb83d5489a2875d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wedding_timelines" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" uuid, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" uuid, "isDeleted" boolean NOT NULL DEFAULT false, "weddingId" uuid NOT NULL, "time" character varying(50) NOT NULL, "title" character varying(255) NOT NULL, "sortOrder" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_90d3abd76ad64da3acacc852f06" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "bankAccountNumber"`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "bankName"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "bankAccountName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "bankTransferNote"`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "vietqrUrl"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "displayOrder" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "showHeroImage" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" ADD "heroImageMain" text`);
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "showIntro" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "showGallery" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "galleryLayout" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "showParty" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "partyType" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "receptionWelcomeTime" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "showCountdown" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "showMap" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "showDressCode" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" ADD "dressCodes" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "showTimeline" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "timelineTitle" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "showRsvp" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "rsvpType" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "showGuestbook" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "guestbookStatic" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "guestbookFloating" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "showThankYou" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" ADD "thankYouText" text`);
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "groomShortName" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "groomTitle" character varying(100)`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" ADD "groomAddress" text`);
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "brideShortName" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "brideTitle" character varying(100)`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" ADD "brideAddress" text`);
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "musicName" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "groomBankAccount" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "groomBankName" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "groomBankOwner" character varying(100)`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" ADD "groomQrUrl" text`);
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "brideBankAccount" character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "brideBankName" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "brideBankOwner" character varying(100)`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" ADD "brideQrUrl" text`);
    await queryRunner.query(
      `ALTER TABLE "wedding_events" ADD CONSTRAINT "FK_5017733f7d4d3cafbc86046770b" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_timelines" ADD CONSTRAINT "FK_35a19e8b0e06cc425a7f7c92d36" FOREIGN KEY ("weddingId") REFERENCES "weddings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wedding_timelines" DROP CONSTRAINT "FK_35a19e8b0e06cc425a7f7c92d36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wedding_events" DROP CONSTRAINT "FK_5017733f7d4d3cafbc86046770b"`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "brideQrUrl"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "brideBankOwner"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "brideBankName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "brideBankAccount"`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "groomQrUrl"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "groomBankOwner"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "groomBankName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "groomBankAccount"`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "musicName"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "brideAddress"`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "brideTitle"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "brideShortName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "groomAddress"`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "groomTitle"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "groomShortName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "thankYouText"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "showThankYou"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "guestbookFloating"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "guestbookStatic"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "showGuestbook"`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "rsvpType"`);
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "showRsvp"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "timelineTitle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "showTimeline"`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "dressCodes"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "showDressCode"`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "showMap"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "showCountdown"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "receptionWelcomeTime"`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "partyType"`);
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "showParty"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "galleryLayout"`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "showGallery"`);
    await queryRunner.query(`ALTER TABLE "weddings" DROP COLUMN "showIntro"`);
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "heroImageMain"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "showHeroImage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" DROP COLUMN "displayOrder"`,
    );
    await queryRunner.query(`ALTER TABLE "weddings" ADD "vietqrUrl" text`);
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "bankTransferNote" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "bankAccountName" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "bankName" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "weddings" ADD "bankAccountNumber" character varying(50)`,
    );
    await queryRunner.query(`DROP TABLE "wedding_timelines"`);
    await queryRunner.query(`DROP TABLE "wedding_events"`);
  }
}
