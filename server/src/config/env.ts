import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export const env = {
  port: Number(process.env.API_PORT ?? 4000),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET ?? 'tripstay-dev-secret',
  dbHost: process.env.DB_HOST ?? '127.0.0.1',
  dbPort: Number(process.env.DB_PORT ?? 3306),
  dbUser: process.env.DB_USER ?? 'root',
  dbPassword: process.env.DB_PASSWORD ?? '',
  dbName: process.env.DB_NAME ?? 'tripstay',
};
