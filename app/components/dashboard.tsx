'use client';

import { useState, useEffect } from 'react';
import { LNFCard } from '../components/ui/LNF_card';
import { Card, CardContent, CardHeader, CardTitle } from '..//components/ui/card';
import { Separator } from '../components/ui/separator';

const items = [
  {
    title: '갤럭시 버즈3 프로',
    dateAcquired: '2025-03-13',
    location: '2-4',
    disposalDate: '2025-03-27',
    image: 'https://url.kr/cqi4sj',
  },
  {
    title: '아이폰 15',
    dateAcquired: '2025-03-10',
    location: '3-2',
    disposalDate: '2025-03-25',
    image: 'https://blog.kakaocdn.net/dn/cZIUet/btsEGiAfpmX/xiFZZnhWZJQwlrNKW8fPX1/img.jpg',
  },
  {
    title: '태블릿 X',
    dateAcquired: '2025-03-05',
    location: '1-1',
    disposalDate: '2025-03-20',
    image: '',
  },
  {
    title: '스마트워치 Z',
    dateAcquired: '2025-03-01',
    location: '4-3',
    disposalDate: '2025-03-15',
    image: '',
  },
  {
    title: '스마트워치 Z',
    dateAcquired: '2025-03-01',
    location: '4-3',
    disposalDate: '2025-03-15',
    image: '',
  },
];

const meals = [
  {
    meal_NM: '석식',
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
    meal_NM: '조식',
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

export function Dashboard() {
  const itemsPerPage = 4;
  // 전체 페이지 수 계산 (총 항목이 4의 배수가 아니면 마지막 페이지는 남은 항목만)
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (totalPages <= 1) return; // 항목이 4개 이하인 경우 페이지 전환 없이 그대로 표시
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalPages]);

  // 현재 페이지에 해당하는 항목들만 표시
  const currentItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className='flex h-screen min-h-0 flex-col p-4'>
      <div className='flex h-full flex-grow flex-col gap-4 md:flex-row'>
        {/* LNF 영역 */}
        <div className='h-full flex-grow md:w-7/10'>
          <Card className='h-full gap-0'>
            <CardHeader className='pb-2'>
              <CardTitle className='pb-1 text-2xl'>분실물 안내 (LNF)</CardTitle>
            </CardHeader>
            <CardContent className='flex h-full flex-col'>
              <div className='grid h-full grid-cols-2 grid-rows-2 gap-4'>
                {currentItems.map((item, index) => (
                  <div key={index} className='h-auto'>
                    <LNFCard feature={item} />
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
        <Separator className='my-4 md:hidden' />

        {/* Meal 영역 */}
        <div className='md:w-3/10'>
          <Card className='h-full gap-0'>
            <CardHeader className='pb-0'>
              <CardTitle className='pb-1 text-2xl'>오늘의 식단</CardTitle>
            </CardHeader>
            <CardContent>
              {meals.map((meal, index) => (
                <>
                  <h3 className={`mb-2 text-base font-bold${index != 0 ? 'pt-2' : ''}`} key={index}>
                    {meals[0].meal_NM == '석식' && index == 1
                      ? `다음날 ${meal.meal_NM}`
                      : meal.meal_NM}
                  </h3>
                  <Card className='pt-2.5 pb-2.5'>
                    <CardContent>
                      {meal.meal.map((dish, index) => (
                        <p key={index}>{dish}</p>
                      ))}
                    </CardContent>
                  </Card>
                </>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
