import type { Route } from './+types/LNFMS';
import { LNFMS } from '../components/LNFMS';
import { db, itemTable } from '~/db';
import { inArray } from 'drizzle-orm';
import { redirect, useLoaderData } from 'react-router';
import { sessionStorage } from '~/auth.server';
import { z } from 'zod';
import { beautifyZodError } from '~/lib/utils';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'LFNMS' }, { name: 'description', content: '능주고 분실물 관리 시스템' }];
}

export async function loader({ request }: Route.LoaderArgs) {
  console.log('loader');

  let session = await sessionStorage.getSession(request.headers.get('cookie'));
  let user = session.get('user');
  if (!user) return redirect('/login');

  const searchParams = new URL(request.url).searchParams;

  //TODO: Implement search

  const items = await db.select().from(itemTable).limit(10);

  return { items };
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
