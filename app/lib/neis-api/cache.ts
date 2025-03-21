import { eq, sql } from 'drizzle-orm';
import { createHash } from 'crypto';
import { cacheTable, db } from '~/db';

class CacheService {
  private readonly db = db;

  constructor() {
    this.db
      .delete(cacheTable)
      .where(sql`${cacheTable.createdAt} + ${cacheTable.ttl} < ${Date.now()}`)
      .returning({
        key: cacheTable.cacheKey,
      });
  }

  private hashKey(key: string): string {
    return createHash('sha256').update(key).digest('hex');
  }

  public async set(key: string, value: unknown, ttl: number): Promise<boolean> {
    const cacheKey = this.hashKey(key);
    const cacheValue = JSON.stringify(value);
    const createdAt = new Date();

    try {
      await this.db.insert(cacheTable).values({
        cacheKey,
        cacheValue,
        createdAt,
        ttl,
      });
      return true;
    } catch {
      return false;
    }
  }

  public async get<T = string>(key: string): Promise<T | null> {
    const cacheKey = this.hashKey(key);
    const result = await this.db
      .select()
      .from(cacheTable)
      .where(eq(cacheTable.cacheKey, cacheKey))
      .get();

    if (!result) {
      return null;
    }

    /** if cache is expired delete cache and return null */
    if (result.createdAt.getTime() + result.ttl < Date.now()) {
      await this.db.delete(cacheTable).where(eq(cacheTable.cacheKey, cacheKey));
      return null;
    }

    /** if value is Object-like string return parsed Object */
    if (
      (result.cacheValue.startsWith('{') && result.cacheValue.endsWith('}')) ||
      (result.cacheValue.startsWith('[') && result.cacheValue.endsWith(']'))
    ) {
      return JSON.parse(result.cacheValue) as T;
    } else {
      return result.cacheValue as T;
    }
  }

  public async del(key: string): Promise<void> {
    const cacheKey = this.hashKey(key);
    await this.db.delete(cacheTable).where(eq(cacheTable.cacheKey, cacheKey));
  }

  public async has(key: string): Promise<boolean> {
    const cacheKey = this.hashKey(key);
    const result = await this.db
      .select({
        key: cacheTable.cacheKey,
      })
      .from(cacheTable)
      .where(eq(cacheTable.cacheKey, cacheKey))
      .get();

    return !!result;
  }

  public async keys(): Promise<string[]> {
    const results = await this.db
      .select({
        key: cacheTable.cacheKey,
      })
      .from(cacheTable);

    return results.map((result) => result.key);
  }

  public async values(): Promise<string[]> {
    const results = await this.db
      .select({
        value: cacheTable.cacheValue,
      })
      .from(cacheTable);

    return results.map((result) => result.value);
  }

  public async clear(): Promise<void> {
    await this.db.delete(cacheTable);
  }
}

export const cacheService = new CacheService();
