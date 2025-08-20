import { useLoaderData, useRevalidator, useSearchParams } from 'react-router';
import type { JSX } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import type { loader } from '~/routes/LNFMS';

export function LNFMSPagination() {
  const { totalPages } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Math.min(
    Math.max(parseInt(searchParams.get('page') || '1', 10), 1),
    Math.max(totalPages, 1),
  );

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    const params = Object.fromEntries(searchParams.entries());
    // 빈 문자열 파라미터는 제거 (잘못된 datetime 파싱 방지)
    Object.keys(params).forEach((k) => {
      if (params[k] === '') delete params[k];
    });
    params.page = page.toString();
    setSearchParams(params);
    revalidator.revalidate();
  };

  const makePageItem = (page: number, active = false) => (
    <PaginationItem key={page}>
      <PaginationLink
        isActive={active}
        aria-current={active ? 'page' : undefined}
        onClick={() => handlePageChange(page)}
        className='cursor-pointer'
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  );

  const items: JSX.Element[] = [];
  if (totalPages <= 9) {
    for (let p = 1; p <= totalPages; p++) items.push(makePageItem(p, p === currentPage));
  } else {
    // Always show first
    items.push(makePageItem(1, currentPage === 1));
    if (currentPage > 3) {
      items.push(
        <PaginationItem key='start-ellipsis'>
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let p = start; p <= end; p++) items.push(makePageItem(p, p === currentPage));
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key='end-ellipsis'>
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }
    items.push(makePageItem(totalPages, currentPage === totalPages));
  }

  return (
    <div className='flex w-full items-center justify-center gap-4 py-1 text-sm'>
      <div className='text-muted-foreground hidden items-center gap-1 whitespace-nowrap md:flex'>
        <span className='font-medium'>{currentPage}</span>
        <span>/</span>
        <span>{totalPages}</span>
      </div>
      <Pagination className='mx-auto'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-label='이전 페이지'
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-40' : 'cursor-pointer'}
            />
          </PaginationItem>
          {items}
          <PaginationItem>
            <PaginationNext
              aria-label='다음 페이지'
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              className={
                currentPage === totalPages ? 'pointer-events-none opacity-40' : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
