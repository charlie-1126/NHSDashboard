import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { randomUUID } from 'node:crypto';

export const userTable = sqliteTable('user', {
  /**
   * uuid
   */
  uuid: text()
    .primaryKey()
    .$defaultFn(() => randomUUID().toString()),

  /**
   * 유저 id
   * 로그인할 때 사용합니다.
   */
  id: text().unique().notNull(),

  /**
   * 유저 이름
   * 로그인할 때 사용하지 않습니다.
   */
  username: text().unique().notNull(),

  /**
   * 유저 비밀번호
   */
  password: text().notNull(),

  /**
   * 계정 생성일
   */
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});
