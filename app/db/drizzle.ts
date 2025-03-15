import { drizzle } from 'drizzle-orm/libsql';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not provided');
}

export const db = drizzle(process.env.DATABASE_URL!);
