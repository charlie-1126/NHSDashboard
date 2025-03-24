import type { Route } from './+types/LNFMS';
import { LNFMS } from '../components/LNFMS';
import { db, itemTable } from '~/db';
import { and, eq, inArray, like, ne, type SQL, sql } from 'drizzle-orm';
import { redirect } from 'react-router';
import { sessionStorage } from '~/auth.server';
import { z } from 'zod';
import { beautifyZodError } from '~/lib/utils';

export function meta() {
  return [{ title: 'LFNMS' }, { name: 'description', content: '능주고 분실물 관리 시스템' }];
}

const filterSchema = z.object({
  status: z.enum(['ALL', 'PENDING', 'RETURNED', 'DISCARDED']).default('ALL'),
  name: z.string().nullish(),
  reporter: z.string().nullish(),
  receiver: z.string().nullish(),
  location: z.string().nullish(),
  startDate: z
    .string()
    .datetime()
    .nullish()
    .transform((v) => (v ? new Date(v) : null)),
  endDate: z
    .string()
    .datetime()
    .nullish()
    .transform((v) => (v ? new Date(v) : null)),
  page: z.string().default('1'),
});

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get('cookie'));
  const user = session.get('user');
  if (!user) return redirect('/login');

  const searchParams = filterSchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams.entries()),
  );

  if (!searchParams.success) {
    return redirect('/LNFMS');
  }

  const limit = 10;
  const offset = Math.max((parseInt(searchParams.data.page, 10) - 1) * limit, 0);

  const filters: SQL[] = [];

  if (searchParams.data.status !== 'ALL') {
    filters.push(eq(itemTable.status, searchParams.data.status));
  } else {
    filters.push(ne(itemTable.status, 'DELETED'));
  }

  if (searchParams.data.name) {
    filters.push(like(itemTable.name, `%${searchParams.data.name}%`));
  }

  if (searchParams.data.reporter) {
    filters.push(like(itemTable.reporter, `%${searchParams.data.reporter}%`));
  }

  if (searchParams.data.receiver) {
    filters.push(like(itemTable.receiver, `%${searchParams.data.receiver}%`));
  }

  if (searchParams.data.location) {
    filters.push(like(itemTable.location, `%${searchParams.data.location}%`));
  }

  if (searchParams.data.startDate) {
    searchParams.data.startDate.setHours(0, 0, 0);
    filters.push(sql`${itemTable.createdAt} >= ${searchParams.data.startDate.getTime() / 1000}`);
  }

  if (searchParams.data.endDate) {
    searchParams.data.endDate.setHours(23, 59, 59);
    filters.push(sql`${itemTable.createdAt} <= ${searchParams.data.endDate.getTime() / 1000}`);
  }

  const filter = and(...filters);

  const itemsQuery = db.select().from(itemTable).where(filter).limit(limit).offset(offset);
  const countQuery = db
    .select({ count: sql<number>`count(*) / ${limit}` })
    .from(itemTable)
    .where(filter)
    .get();

  const [items, count] = await Promise.all([itemsQuery, countQuery]);

  const totalPages = Math.ceil(count?.count ?? 10 / limit);

  return { items, totalPages };
}

const receiverSchema = z
  .string()
  .min(1, '1글자 이상 입력해주세요.')
  .max(30, '30글자 이하로 입력해주세요.');

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();

    const type = formData.get('type');
    const uuids = formData.getAll('uuid');

    if (type === 'returnItem' || type === 'returnItems') {
      const receiver = receiverSchema.safeParse(formData.get('receiver'));
      if (!receiver.success) {
        receiver.error.errors[0].path = ['receiver'];
        return { errors: beautifyZodError(receiver.error) };
      }
      await db
        .update(itemTable)
        .set({ status: 'RETURNED', receiver: receiver.data })
        .where(
          inArray(
            itemTable.uuid,
            uuids.map((uuid) => uuid.toString()),
          ),
        );

      return { ok: true, type };
    } else if (type === 'deleteItem' || type === 'deleteItems') {
      await db
        .update(itemTable)
        .set({
          status: 'DISCARDED',
          receiver: null,
        })
        .where(
          inArray(
            itemTable.uuid,
            uuids.map((uuid) => uuid.toString()),
          ),
        );
      return { ok: true, type };
    }
  } catch (e) {
    if (e instanceof z.ZodError) {
      return {
        errors: beautifyZodError(e),
      };
    }
  }
}

export default function LNFMSPage() {
  return <LNFMS />;
}
