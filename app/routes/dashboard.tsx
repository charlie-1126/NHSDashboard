import { Dashboard as DashboardComponent } from '../components/dashboard';
import { db, itemTable } from '~/db';
import { eq } from 'drizzle-orm';
import { useLoaderData } from 'react-router';
import { NeisAPIService } from '~/lib/neis-api';
import { add, format } from 'date-fns';
import { ko } from 'date-fns/locale';

const neisAPI = new NeisAPIService();

export function meta() {
  return [{ title: 'NHS Dashboard' }, { name: 'description', content: '능주고 대시보드' }];
}

export async function loader() {
  const items = await db.select().from(itemTable).where(eq(itemTable.status, 'PENDING'));

  const now = new Date();
  const today = format(now, 'yyyyMMdd', { locale: ko });
  const tomorrow = format(add(now, { days: 1 }), 'yyyyMMdd', { locale: ko });

  const meals = (
    await neisAPI.mealInfoNeis({
      ATPT_OFCDC_SC_CODE: 'Q10',
      SD_SCHUL_CODE: '8490081',
      MLSV_FROM_YMD: today,
      MLSV_TO_YMD: tomorrow,
    })
  ).row
    .filter((meal) => {
      const h = now.getHours();
      return h <= 8
        ? meal.MLSV_YMD === today && ['1', '2'].includes(meal.MMEAL_SC_CODE)
        : h <= 16
          ? meal.MLSV_YMD === today && ['2', '3'].includes(meal.MMEAL_SC_CODE)
          : (meal.MLSV_YMD === today && meal.MMEAL_SC_CODE === '3') ||
            (meal.MLSV_YMD === tomorrow && meal.MMEAL_SC_CODE === '1');
    })
    .sort((a, b) => a.MLSV_YMD.localeCompare(b.MLSV_YMD));

  return { items, meals };
}

export default function DashboardPage() {
  const { items, meals } = useLoaderData<typeof loader>();

  return <DashboardComponent items={items} meals={meals} />;
}
