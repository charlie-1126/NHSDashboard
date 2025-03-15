import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user.schema';
import { randomUUID } from 'node:crypto';

export const itemTable = sqliteTable('item', {
  /**
   * uuid
   * @example 'bfc68f45-99c5-4135-b7c5-68bcb8d97972'
   */
  uuid: text()
    .primaryKey()
    .$defaultFn(() => randomUUID().toString()),

  /**
   * 제보자 학번 및 이름
   * @example '1101 홍길동'
   */
  reporter: text().notNull(),

  /**
   * 인수자 학번 및 이름
   * @example '1102 홍길동'
   */
  receiver: text().notNull(),

  /**
   * 제보자 담당자 uuid
   */
  reportHandlerUUID: text('report_handler_uuid')
    .notNull()
    .references(() => userTable.uuid),

  /**
   * 인수자 담당자 uuid
   */
  receiverHandlerUUID: text('receiver_handler_uuid')
    .notNull()
    .references(() => userTable.uuid),

  /**
   * 분실물 이름
   */
  name: text().notNull(),

  /**
   * 분실물 습득 위치
   */
  location: text().notNull(),

  /**
   * 분실물 습득 일시
   */
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),

  /**
   * 분실물 처리 일시
   */
  processedAt: integer('processed_at', { mode: 'timestamp' }),

  /**
   * 분실물 상태
   */
  status: text({ enum: ['PENDING', 'RETURNED', 'DISCARDED', 'DELETED'] })
    .notNull()
    .default('PENDING')
    .$type<'PENDING' | 'RETURNED' | 'DISCARDED' | 'DELETED'>(),

  /**
   * 분실물 사진
   * TODO: 이미지 저장 방식 결정
   */
  image: text().notNull(),
});
