import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdmin1779784363178 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = 'admin123@';
    const hashedPassword = await bcrypt.hash(password, 10);

    await queryRunner.query(
      `INSERT INTO "users" 
            ("id", "createdAt", "createdBy", "fullName","email", "passwordHash", "phone", "isActive") 
            VALUES 
            (gen_random_uuid(), now(), 'system', 'admin', 'admin@example.com', '${hashedPassword}', 0123123123, true)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
