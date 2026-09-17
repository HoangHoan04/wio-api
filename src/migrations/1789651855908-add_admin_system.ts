import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminSystem1789651855908 implements MigrationInterface {
  name = 'AddAdminSystem1789651855908';

  private readonly adminEmail = 'admin123@gmail.com';
  private readonly adminPassword = 'admin123@';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Kiểm tra admin đã tồn tại chưa
    const existing = await queryRunner.query(
      `SELECT id FROM "users" WHERE email = $1`,
      [this.adminEmail],
    );
    if (existing.length > 0) return;

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(this.adminPassword, 10);

    await queryRunner.query(
      `INSERT INTO "users" (
        "id", "createdAt", "password", "email",
        "role", "isActive", "isDeleted"
      ) VALUES (
        gen_random_uuid(), now(), $1, $2,
        $3, true, false
      )`,
      [hashedPassword, this.adminEmail, 'ADMIN'],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users" WHERE email = $1`, [
      this.adminEmail,
    ]);
  }
}
