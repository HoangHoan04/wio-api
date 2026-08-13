import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminSystem1786629794409 implements MigrationInterface {
  name = 'AddAdminSystem1786629794409';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const existingAdmin = await queryRunner.query(
      `SELECT id FROM "users" WHERE email = $1`,
      ['admin@wio.vn'],
    );

    if (existingAdmin.length > 0) {
      return;
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    await queryRunner.query(
      `INSERT INTO "users" (
        "id",
        "createdAt",
        "password",
        "email",
        "isAdmin",
        "role",
        "isActive",
        "isDeleted"
      ) VALUES (
        gen_random_uuid(),
        now(),
        $1,
        $2,
        true,
        $3,
        true,
        false
      )`,
      [hashedPassword, 'admin@wio.vn', 'ADMIN'],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users" WHERE email = $1`, [
      'admin@wio.vn',
    ]);
  }
}
