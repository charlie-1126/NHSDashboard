import type { Route } from './+types/item';
import { db, itemTable } from '~/db';
import { eq } from 'drizzle-orm';
import { redirect, useLoaderData } from 'react-router';
import { sessionStorage } from '~/auth.server';
import { ItemDetail } from '~/components/item-detail';

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data.displayName ? `LFNMS - ${data.displayName}` : 'LFNMS' },
    { name: 'description', content: '능주고 분실물 관리 시스템' },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  let session = await sessionStorage.getSession(request.headers.get('cookie'));
  let user = session.get('user');
  if (!user) return redirect('/login');

  const { id } = params;
  if (!id) return redirect('/item/new');

  const item = await db.select().from(itemTable).where(eq(itemTable.uuid, id)).get();
  if (!item && id != 'new') return redirect('/LNFMS');
  const displayName = id == 'new' ? 'NEW' : item?.name;

  return { item, id, displayName };
}

export default function ItemPage() {
  const { item, id } = useLoaderData<typeof loader>();

  return <ItemDetail item={item} id={id} />;
}
