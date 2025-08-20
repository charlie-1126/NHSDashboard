import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
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
  const [now, setNow] = useState(() => new Date());
  const reduceMotionRef = useRef<boolean>(false);
  const [scale, setScale] = useState(1);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceMotionRef.current = mq.matches;
    const listener = () => (reduceMotionRef.current = mq.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (totalPages <= 1) return;
    if (document.visibilityState !== 'visible') return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 8000);
    return () => clearInterval(interval);
  }, [totalPages, currentPage]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setNow(new Date());
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => revalidator.revalidate(), 60_000);
    return () => clearInterval(interval);
  }, []);

  const currentItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const dateStr = format(now, 'yyyy.MM.dd (EEE)', { locale: ko });
  const timeStr = format(now, 'HH:mm:ss');

  useLayoutEffect(() => {
    let resizeTimer: number | null = null;
    const recompute = () => {
      const el = contentRef.current;
      if (!el) return;
      const naturalHeight = el.scrollHeight;
      const naturalWidth = el.scrollWidth;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const hScale = vh / naturalHeight;
      const wScale = vw / naturalWidth;
      const next = Math.min(1, hScale, wScale);
      setScale(next);
    };
    requestAnimationFrame(recompute);
    const handleResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(recompute, 120);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [items.length, meals.length, currentPage]);

  return (
    <div className='bg-background relative flex h-screen w-screen items-start justify-center overflow-hidden'>
      {/* 레터박스 영역 (16:9 종횡비 유지) - 상단 정렬 */}
      <div className='relative h-full max-h-full w-full max-w-full'>
        <div className='absolute inset-0 flex items-start justify-center pt-0'>
          <div className='aspect-video max-h-full w-full max-w-full'>
            <div
              ref={contentRef}
              className='flex h-full w-full flex-col px-4 pt-1 pb-4'
              style={
                scale < 0.999
                  ? {
                      transform: `scale(${scale})`,
                      transformOrigin: 'top center',
                      willChange: 'transform',
                    }
                  : undefined
              }
            >
              {/* 상단 바: 날짜 & 시간 */}
              <div className='mb-1 flex items-end justify-between pr-2 pl-1 md:mb-2'>
                <h1 className='text-2xl font-bold tracking-tight md:text-3xl xl:text-4xl'>
                  NHS 분실물 & 급식
                </h1>
                <div className='text-right font-mono'>
                  <div className='text-base font-semibold md:text-xl xl:text-2xl'>{timeStr}</div>
                  <div className='text-muted-foreground text-[11px] md:text-sm xl:text-base'>
                    {dateStr}
                  </div>
                </div>
              </div>
              <div className='flex h-full flex-1 flex-col gap-4 md:grid md:grid-cols-[7fr_3fr] md:gap-6'>
                {/* LNF 영역 */}
                <div
                  className='flex h-full flex-col'
                  role='region'
                  aria-labelledby='lostfound-heading'
                >
                  <Card className='h-full gap-0'>
                    <CardHeader className='pb-3'>
                      <CardTitle
                        id='lostfound-heading'
                        className='text-center text-3xl font-bold tracking-tight xl:text-4xl'
                      >
                        분실물 안내
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='flex h-full flex-col pt-0'>
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
                          className='mt-4 flex justify-center gap-2'
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
                <div className='flex h-full flex-col' role='region' aria-labelledby='meal-heading'>
                  <Card className='h-full gap-0'>
                    <CardHeader className='pb-2'>
                      <CardTitle
                        id='meal-heading'
                        className='text-center text-3xl font-bold tracking-tight xl:text-4xl'
                      >
                        급식 식단
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='relative h-full space-y-5 pt-0'>
                      {meals.map((meal, index) => {
                        return (
                          <div
                            key={`${meal.MLSV_YMD}-${meal.MMEAL_SC_CODE}-${index}`}
                            className='relative'
                          >
                            <div
                              className={`mb-2 flex items-end gap-2 ${index !== 0 ? 'pt-1' : ''}`}
                            >
                              <h3 className='text-lg font-semibold tracking-tight md:text-xl xl:text-2xl'>
                                {format(parse(meal.MLSV_YMD, 'yyyyMMdd', new Date()), 'M월 d일', {
                                  locale: ko,
                                })}{' '}
                                {meal.MMEAL_SC_NM}
                              </h3>
                              <span className='text-muted-foreground mb-0.5 text-xs font-medium md:text-sm xl:text-base'>
                                {meal.CAL_INFO}
                              </span>
                            </div>
                            <Card className='pt-3 pb-3 transition-colors'>
                              <CardContent>
                                <ul className='marker:text-primary/30 list-outside list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed md:text-sm xl:space-y-2 xl:text-base 2xl:text-lg'>
                                  {meal.DDISH_NM.split('<br/>').map((dish, di) => {
                                    const t = dish.trim();
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
