import type { Route } from './+types/dashboard';
import { Home } from '../components/home';
import { db, itemTable } from '~/db';
import { eq } from 'drizzle-orm';
import { useLoaderData } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'NHS Dashboard' }, { name: 'description', content: '능주고 대시보드' }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const items = await db.select().from(itemTable).where(eq(itemTable.status, 'PENDING'));
  return { items };
}

export default function Dashboard() {
  const { items } = useLoaderData<typeof loader>();

  return <Home items={items} />;
}
