import { useLoaderData, useRevalidator, useSearchParams } from 'react-router';
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
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  function handlePageChange(page: number) {
    setSearchParams({ page: page.toString() });
    revalidator.revalidate();
  }

  return (
    <Pagination>
      <PaginationContent>
        {/* 이전 페이지 */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>

        {/* 첫번째 페이지 */}
        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
          </PaginationItem>
        )}

        {/* 생략 */}
        {currentPage > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* 이전 페이지 */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* 현재 페이지 */}
        <PaginationItem>
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>

        {/* 다음 페이지 */}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* 생략 */}
        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* 마지막 페이지 */}
        {currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* 다음 페이지 */}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            className={
              currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
