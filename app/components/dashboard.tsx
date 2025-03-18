import { useState, useEffect } from 'react';
import { LNFDashboardCard } from './LNFDashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import type { itemTable } from '~/db';
import '../styles/font.css';
import type { MealResponse } from '~/lib/neis-api';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';

export function Dashboard({
  items,
  meals,
}: {
  items: (typeof itemTable.$inferSelect)[];
  meals: MealResponse['row'];
}) {
  const itemsPerPage = 4;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (totalPages <= 1) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalPages]);

  const currentItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className='flex h-screen min-h-0 flex-col p-4'>
      <div className='flex h-full flex-grow flex-col gap-4 md:flex-row'>
        {/* LNF 영역 */}
        <div className='h-full flex-grow md:w-7/10'>
          <Card className='h-full gap-0'>
            <CardHeader className='pb-7'>
              <CardTitle className='pb-1 text-center text-3xl'>분실물 안내 (LNF)</CardTitle>
            </CardHeader>
            <CardContent className='flex h-full flex-col'>
              <div className='grid h-full grid-cols-2 grid-rows-2 gap-4'>
                {currentItems.map((item, index) => (
                  <div key={index} className='h-auto'>
                    <LNFDashboardCard item={item} />
                  </div>
                ))}
                {/* 빈 셀을 추가하여 그리드를 채움 */}
                {Array.from({ length: Math.max(0, 4 - currentItems.length) }).map((_, index) => (
                  <div key={`empty-${index}`} className='h-auto'></div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className='mt-4 flex justify-center space-x-1'>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full ${currentPage === index ? 'bg-primary' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 구분선 (모바일에서는 수평선, 데스크톱에서는 수직선) */}
        <div className='hidden md:block'>
          <Separator orientation='vertical' className='h-full' />
        </div>

        {/* Meal 영역 */}
        <div className='md:w-3/10'>
          <Card className='h-full gap-0'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-center text-3xl'>급식 식단</CardTitle>
            </CardHeader>
            <CardContent className='relative h-full'>
              {meals.map((meal, index) => (
                <div className='pb-4' key={index}>
                  <h3 className={`mb-2 text-xl font-bold ${index !== 0 ? 'pt-2' : ''}`}>
                    {format(parse(meal.MLSV_YMD, 'yyyyMMdd', new Date()), 'M월 d일', {
                      locale: ko,
                    })}{' '}
                    {meal.MMEAL_SC_NM}
                  </h3>
                  <Card className='pt-2.5 pb-2.5'>
                    <CardContent>
                      <ul className='list-inside list-disc marker:text-gray-300'>
                        {meal.DDISH_NM.split('<br/>').map((dish: any, index: any) => (
                          <li key={index}>{dish.trim()}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className='font-custom text-muted-foreground fixed right-6 bottom-5 z-50 text-lg'>
          NHS Dashboard by 이예찬, bmcyver
        </div>
      </div>
    </div>
  );
}
