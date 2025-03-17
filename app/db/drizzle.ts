import { drizzle } from 'drizzle-orm/libsql';

if (!import.meta.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not provided');
}

export const db = drizzle(import.meta.env.DATABASE_URL!);
