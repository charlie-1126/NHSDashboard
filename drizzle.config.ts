import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  dialect: 'sqlite',
  schema: './app/db/schemas/*.schema.ts',

  dbCredentials: {
    url: process.env.VITE_DATABASE_URL!,
  },

  out: './drizzle',
});
