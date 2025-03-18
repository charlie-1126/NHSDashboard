import type { Route } from './+types/LNFMS';
import { LNFMS } from '../components/LNFMS';
import { db, itemTable } from '~/db';
import { eq } from 'drizzle-orm';
import { redirect, useLoaderData } from 'react-router';
import { sessionStorage } from '~/auth.server';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'LFNMS' }, { name: 'description', content: '능주고 분실물 관리 시스템' }];
}

export async function loader({ request }: Route.LoaderArgs) {
  console.log('loader!');

  let session = await sessionStorage.getSession(request.headers.get('cookie'));
  let user = session.get('user');
  if (!user) return redirect('/login');

  const items = await db.select().from(itemTable);

  return { items };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  console.log('formData', formData);

  return { ok: true, type: formData.get('type') };
}

export default function LNFMSPage() {
  const { items } = useLoaderData<typeof loader>();

  return <LNFMS items={items} />;
}
