import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixTemplateSlug1780732587533 implements MigrationInterface {
  name = 'FixTemplateSlug1780732587533';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const themeSlugMap: Record<string, string> = {
      BOHO_FLORAL_BROWN: 'hoa-moc-lan-nau',
      BOHO_FLORAL_GREEN: 'hoa-moc-lan-xanh',
      BOHO_FLORAL_PINK: 'hoa-moc-lan-hong',
      DOUBLE_PHOENIX_BLUE: 'song-phung-xanh',
      DOUBLE_PHOENIX_GREEN: 'song-phung-xanh-la',
      DOUBLE_PHOENIX_RED: 'song-phung-do',
      DOUBLE_DRAGON_BLUE: 'song-long-xanh',
      DOUBLE_DRAGON_GREEN: 'song-long-xanh-la',
      DOUBLE_DRAGON_RED: 'song-long-do',
      DRAGON_PHOENIX_RED: 'long-phung-do',
      ROYAL_RED: 'hoang-gia-do',
      RED_DOUBLE_HAPPINESS: 'song-hy-do',
    };

    for (const [themeCode, slug] of Object.entries(themeSlugMap)) {
      const rows: { id: string }[] = await queryRunner.query(
        `SELECT "id" FROM "templates" WHERE "themeCode" = $1 AND "isDeleted" = false ORDER BY "createdAt" ASC`,
        [themeCode],
      );

      for (let i = 0; i < rows.length; i++) {
        const id = rows[i].id;
        const newSlug = i === 0 ? slug : `${slug}-${id.substring(0, 8)}`;
        await queryRunner.query(
          `UPDATE "templates" SET "slug" = $1 WHERE "id" = $2 AND "slug" IS DISTINCT FROM $1`,
          [newSlug, id],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
