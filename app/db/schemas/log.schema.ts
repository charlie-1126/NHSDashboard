import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user.schema';
import { itemTable } from './item.schema';
import { randomUUID } from 'node:crypto';

export const logTable = sqliteTable('log', {
  /**
   * uuid
   * @example 'bfc68f45-99c5-4135-b7c5-68bcb8d97972'
   */
  uuid: text()
    .primaryKey()
    .$defaultFn(() => randomUUID().toString()),

  /**
   * 로그 제목
   */
  title: text().notNull(),

  /**
   * 분실물 uuid
   */
  itemUUID: text('item_uuid')
    .notNull()
    .references(() => itemTable.uuid),

  /**
   * 로그 기록한 사용자
   */
  userUUID: text('user_uuid')
    .notNull()
    .references(() => userTable.uuid),

  /**
   * 로그 기록한 시간
   */
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),

  /**
   * metadata
   */
  metadata: text({ mode: 'json' }).notNull().default({}),
});
