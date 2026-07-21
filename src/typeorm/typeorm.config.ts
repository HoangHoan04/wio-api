import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';

if (process.env.NODE_ENV !== 'production') {
  try {
    const envFile =
      process.env.NODE_ENV === 'development' ? '.env.dev' : '.env';
    const envPath = path.resolve(process.cwd(), envFile);
    const result = dotenv.config({ path: envPath });
    if (result.error) {
      console.log(`Không tìm thấy ${envFile}, fallback về .env`);
      dotenv.config({ path: path.resolve(process.cwd(), '.env') });
    } else {
      console.log(`Loaded environment from: ${envFile}`);
    }
  } catch (error) {
    console.log('dotenv not loaded:', error);
  }
}

const port = parseInt(process.env.TYPEORM_PORT ?? '5432', 10);
export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: !process.env.DATABASE_URL ? process.env.TYPEORM_HOST : undefined,
  port: !process.env.DATABASE_URL ? port : undefined,
  username: !process.env.DATABASE_URL
    ? process.env.TYPEORM_USERNAME
    : undefined,
  password: !process.env.DATABASE_URL
    ? process.env.TYPEORM_PASSWORD
    : undefined,
  database: !process.env.DATABASE_URL
    ? process.env.TYPEORM_DATABASE
    : undefined,

  logging: process.env.TYPEORM_LOGGING === 'true',

  entities: [__dirname + '/../entities/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],

  ssl: false,

  extra: {
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
});
