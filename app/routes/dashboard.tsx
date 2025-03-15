import type { Route } from './+types/dashboard';
import { Dashboard as DashboardComponent } from '../components/Dashboard';
import { db, itemTable } from '~/db';
import { eq } from 'drizzle-orm';
import { useLoaderData } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'NHS Dashboard' }, { name: 'description', content: '능주고 대시보드' }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const items = await db.select().from(itemTable).where(eq(itemTable.status, 'PENDING'));
  const meals = [
    {
      meal_NM: '3.1(화) 석식',
      meal: [
        '쌀밥',
        '돈육김치찌개 (5.9.10)',
        '볼어묵야채볶음 (1.5.6)',
        '오이무침 (5.6.13)',
        '치즈달걀말이 (1.2.5)',
        '소품떡/소스 (2.5.6.10.12.13.15.16)',
        '돌산갓김치 (9)',
        '짜먹는요구르트(딸기) (2)',
      ],
    },
    {
      meal_NM: '3.2(수) 조식',
      meal: [
        '쌀밥',
        '돈육김치찌개 (5.9.10)',
        '볼어묵야채볶음 (1.5.6)',
        '오이무침 (5.6.13)',
        '치즈달걀말이 (1.2.5)',
        '소품떡/소스 (2.5.6.10.12.13.15.16)',
        '돌산갓김치 (9)',
        '짜먹는요구르트(딸기) (2)',
      ],
    },
  ];
  return { items, meals };
}

export default function Dashboard() {
  const { items, meals } = useLoaderData<typeof loader>();

  return <DashboardComponent items={items} meals={meals} />;
}
