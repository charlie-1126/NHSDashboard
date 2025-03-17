import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const cacheTable = sqliteTable('cache', {
  cacheKey: text().unique().primaryKey(),
  cacheValue: text().notNull(),
  createdAt: integer({
    mode: 'timestamp_ms',
  }).notNull(),
  ttl: integer().default(0).notNull(),
});
