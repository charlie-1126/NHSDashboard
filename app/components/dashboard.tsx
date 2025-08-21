import React, { useState, useEffect, useRef } from 'react';
import { LNFItemCard } from './LNFItemCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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
  const reduceMotionRef = useRef<boolean>(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const MESSAGES: React.ReactNode[] = [
    <>
      습득한 분실물은 <strong className='font-bold'>방송실</strong>에서 보관 중입니다.
    </>,
    <>
      <span className='font-semibold underline' aria-hidden='true'>
        njdash.bmcyver.dev
      </span>
      으로 접속하여 분실물을 확인할 수 있습니다.
    </>,
  ];
  const [showAltMessage, setShowAltMessage] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceMotionRef.current = mq.matches;
    const listener = () => (reduceMotionRef.current = mq.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    // 항상 돌아야 하는 메시지 토글
    if (totalPages <= 1) {
      const interval1 = setInterval(() => {
        setShowAltMessage((prev) => !prev);
      }, 8000);

      return () => {
        clearInterval(interval1);
      };
    }

    // 둘 다 동시에 8초마다 실행
    const interval = setInterval(() => {
      setShowAltMessage((prev) => !prev);
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, [totalPages, currentPage]);

  useEffect(() => {
    const handleVisibility = () => {};
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => revalidator.revalidate(), 60_000);
    return () => clearInterval(interval);
  }, []);

  const currentItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className='bg-background relative flex h-screen w-screen items-start justify-center overflow-hidden'>
      <div className='relative h-full w-full'>
        <div className='absolute inset-0 flex items-start justify-center pt-0'>
          <div className='h-full w-full'>
            <div ref={contentRef} className='flex h-full min-h-0 w-full flex-col px-4 pt-1 pb-4'>
              <div className='flex h-full min-h-0 flex-1 flex-col gap-4 md:grid md:grid-cols-[7fr_3fr] md:gap-6'>
                {/* LNF 영역 */}
                <div
                  className='flex h-full min-h-0 flex-col'
                  role='region'
                  aria-labelledby='lostfound-heading'
                >
                  <Card className='h-full gap-0 pt-2 xl:pt-4 2xl:pt-8'>
                    <CardHeader className='pb-3'>
                      <CardTitle
                        id='lostfound-heading'
                        className='text-center text-2xl font-bold tracking-tight xl:text-4xl 2xl:text-5xl'
                      >
                        분실물 안내
                      </CardTitle>
                      <div
                        role='note'
                        aria-live='polite'
                        className='text-muted-foreground mt-1 text-center text-sm font-semibold 2xl:text-xl'
                      >
                        <span
                          className={
                            reduceMotionRef.current ? '' : 'transition-opacity duration-500'
                          }
                        >
                          {MESSAGES[showAltMessage ? 1 : 0]}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className='flex h-full min-h-0 flex-1 flex-col pt-0'>
                      {items.length == 0 ? (
                        <div className='text-muted-foreground flex h-full flex-col items-center justify-center py-10 text-center select-none'>
                          <PackageX className='mb-2 h-10 w-10 opacity-30' />
                          <p className='text-sm'>등록된 분실물이 없습니다.</p>
                        </div>
                      ) : (
                        <div
                          key={currentPage}
                          className={`grid h-full grid-cols-2 grid-rows-2 gap-4 ${
                            reduceMotionRef.current ? '' : 'animate-in fade-in duration-700'
                          }`}
                        >
                          {currentItems.map((item, index) => (
                            <div
                              key={item.uuid ?? index}
                              className={`${
                                reduceMotionRef.current
                                  ? ''
                                  : 'animate-in fade-in slide-in-from-bottom-2 duration-500'
                              } h-auto`}
                            >
                              <LNFItemCard item={item} variant='dashboard' />
                            </div>
                          ))}
                          {Array.from({ length: Math.max(0, 4 - currentItems.length) }).map(
                            (_, index) => (
                              <div
                                key={`empty-${index}`}
                                className='border-border/40 bg-muted/10 h-auto rounded-xl border border-dashed'
                              ></div>
                            ),
                          )}
                        </div>
                      )}
                      {totalPages > 1 && (
                        <div
                          className='mt-2 flex justify-center gap-2'
                          role='tablist'
                          aria-label='분실물 페이지네이션'
                        >
                          {Array.from({ length: totalPages }).map((_, index) => {
                            const active = currentPage === index;
                            return (
                              <button
                                type='button'
                                key={index}
                                role='tab'
                                aria-selected={active}
                                aria-label={`${index + 1} 페이지`}
                                onClick={() => setCurrentPage(index)}
                                className={`focus-visible:ring-ring h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 ${
                                  active
                                    ? 'bg-primary w-6 shadow'
                                    : 'bg-muted hover:bg-primary/40 w-2'
                                }`}
                              />
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                {/* Meal 영역 */}
                <div
                  className='flex h-full min-h-0 flex-col'
                  role='region'
                  aria-labelledby='meal-heading'
                >
                  <Card className='h-full gap-0 pt-2 xl:pt-4 2xl:pt-8'>
                    <CardHeader className='pb-2'>
                      <CardTitle
                        id='meal-heading'
                        className='text-center text-2xl font-bold tracking-tight xl:text-4xl 2xl:text-5xl'
                      >
                        급식 식단
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='relative h-full min-h-0 flex-1 space-y-5 pt-0 2xl:pt-3'>
                      {meals.map((meal, index) => {
                        return (
                          <div
                            key={`${meal.MLSV_YMD}-${meal.MMEAL_SC_CODE}-${index}`}
                            className='relative'
                          >
                            <div
                              className={`mb-2 flex items-end gap-2 ${index !== 0 ? 'pt-1' : ''}`}
                            >
                              <h3 className='text-base font-semibold tracking-tight xl:text-2xl 2xl:text-4xl'>
                                {format(parse(meal.MLSV_YMD, 'yyyyMMdd', new Date()), 'M월 d일', {
                                  locale: ko,
                                })}{' '}
                                {meal.MMEAL_SC_NM}
                              </h3>
                              <span className='text-muted-foreground mb-0.5 text-sm font-semibold xl:text-lg 2xl:text-2xl'>
                                {meal.CAL_INFO}
                              </span>
                            </div>
                            <Card className='pt-3 pb-3 transition-colors'>
                              <CardContent>
                                <ul className='marker:text-primary/30 list-outside list-disc space-y-1.5 pl-5 text-sm leading-relaxed font-semibold xl:space-y-2 xl:text-lg 2xl:text-2xl'>
                                  {meal.DDISH_NM.split('<br/>').map((dish, di) => {
                                    const t = dish.trim().replace(/\s*\(\d+(\.\d+)*\)$/, '');
                                    return (
                                      <li key={di} className='break-keep'>
                                        {t}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>
              </div>
              {/* footer removed per request */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
