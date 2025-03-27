import { useState, useEffect } from 'react';
import { LNFDashboardCard } from './LNFDashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import '../styles/font.css';
import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PackageX } from 'lucide-react';
import { useLoaderData, useRevalidator } from 'react-router';
import type { loader } from '~/routes/dashboard';

export function Dashboard() {
  const { items, meals } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

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

  useEffect(() => {
    const interval = setInterval(() => revalidator.revalidate(), 60_000);
    return () => clearInterval(interval);
  }, []);

  const currentItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className='pointer-events-none flex h-screen min-h-0 flex-col p-4 select-none'>
      <div className='flex h-full flex-grow flex-col gap-4 md:flex-row'>
        {/* LNF 영역 */}
        <div className='h-full flex-grow md:w-7/10'>
          <Card className='h-full gap-0'>
            <CardHeader className='pb-7'>
              <CardTitle className='pb-1 text-center text-3xl'>분실물 안내</CardTitle>
            </CardHeader>
            <CardContent className='flex h-full flex-col'>
              {items.length == 0 ? (
                <div className='text-muted-foreground flex h-full flex-col items-center justify-center pb-20 text-center select-none'>
                  <PackageX className='mb-2 h-10 w-10 opacity-20' />
                  <p>등록된 분실물이 없습니다.</p>
                </div>
              ) : (
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
              )}
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
                  <div className={`mb-2 flex items-center ${index !== 0 ? 'pt-2' : ''}`}>
                    <h3 className={`text-xl font-bold`}>
                      {format(parse(meal.MLSV_YMD, 'yyyyMMdd', new Date()), 'M월 d일', {
                        locale: ko,
                      })}{' '}
                      {meal.MMEAL_SC_NM}
                    </h3>
                    <span className='text-muted-foreground ml-2.5 pt-1 font-bold'>
                      {meal.CAL_INFO}
                    </span>
                  </div>
                  <Card className='pt-2.5 pb-2.5'>
                    <CardContent>
                      <ul className='list-inside list-disc marker:text-gray-300'>
                        {meal.DDISH_NM.split('<br/>').map((dish, index) => (
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
