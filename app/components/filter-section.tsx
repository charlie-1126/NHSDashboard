import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardTitle } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CalendarIcon, ChevronDown, ChevronUp, FilterX } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import * as React from 'react';

export type FilterValues = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  location: string;
  name: string;
  status: string;
  reporter: string;
  receiver: string;
};

type FilterSectionProps = {
  filters: FilterValues;
  setFilters: React.Dispatch<React.SetStateAction<FilterValues>>;
  resetFilters: () => void;
};

export function FilterSection({ filters, setFilters, resetFilters }: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    checkIsMobile();
    const handleResize = () => checkIsMobile();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //필터 적용됨?
  const isFilterApplied = () => {
    return (
      !!filters.startDate ||
      !!filters.endDate ||
      !!filters.location ||
      !!filters.name ||
      (!!filters.status && filters.status !== 'ALL') ||
      !!filters.reporter ||
      !!filters.receiver
    );
  };

  return (
    <Card className='gap-0 p-0'>
      <CardTitle className='px-3 py-1 md:py-2'>
        <div className='flex items-center justify-between'>
          <h3 className='text-base'>{isFilterApplied() ? 'Filter *' : 'Filter'}</h3>
          <div className='flex gap-0 md:gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={resetFilters}
              className='text-muted-foreground h-7 px-2 text-xs'
            >
              <FilterX size={14} className='mr-1' />
              초기화
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsExpanded(!isExpanded)}
              className='h-7 w-7'
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          </div>
        </div>
      </CardTitle>
      {isExpanded && (
        <CardContent className='grid grid-cols-3 gap-1.5 px-2 py-1 md:gap-3 md:p-3'>
          <div className='space-y-1'>
            <Label htmlFor='name' className='text-xs'>
              이름
            </Label>
            <Input
              id='name'
              placeholder='이름 검색'
              value={filters.name}
              onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
              className='h-8 text-xs md:text-sm'
            />
          </div>

          <div className='space-y-1'>
            <Label htmlFor='date-from' className='text-xs'>
              시작 날짜
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id='date-from'
                  variant='outline'
                  className='h-8 w-full justify-start text-left text-xs font-normal md:text-sm'
                >
                  <CalendarIcon className='mr-2 h-3.5 w-3.5' />
                  {filters.startDate ? (
                    format(filters.startDate, isMobile ? 'yyyy/MM/dd' : 'yyyy년 MM월 dd일', {
                      locale: ko,
                    })
                  ) : (
                    <span>날짜 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={filters.startDate}
                  onSelect={(date) => setFilters((prev) => ({ ...prev, startDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className='space-y-1'>
            <Label htmlFor='date-to' className='text-xs'>
              종료 날짜
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id='date-to'
                  variant='outline'
                  className='h-8 w-full justify-start text-left text-xs font-normal md:text-sm'
                >
                  <CalendarIcon className='mr-2 h-3.5 w-3.5' />
                  {filters.endDate ? (
                    format(filters.endDate, isMobile ? 'yyyy/MM/dd' : 'yyyy년 MM월 dd일', {
                      locale: ko,
                    })
                  ) : (
                    <span>날짜 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={filters.endDate}
                  onSelect={(date) => setFilters((prev) => ({ ...prev, endDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className='space-y-1'>
            <Label htmlFor='reporter' className='text-xs'>
              제보자
            </Label>
            <Input
              id='reporter'
              placeholder='제보자 검색'
              value={filters.reporter}
              onChange={(e) => setFilters((prev) => ({ ...prev, reporter: e.target.value }))}
              className='h-8 text-xs md:text-sm'
            />
          </div>

          <div className='space-y-1'>
            <Label htmlFor='receiver' className='text-xs'>
              인수자
            </Label>
            <Input
              id='receiver'
              placeholder='인수자 검색'
              value={filters.receiver}
              onChange={(e) => setFilters((prev) => ({ ...prev, receiver: e.target.value }))}
              className='h-8 text-xs md:text-sm'
            />
          </div>

          <div className='space-y-1'>
            <Label htmlFor='location' className='text-xs'>
              위치
            </Label>
            <Input
              id='location'
              placeholder='위치 검색'
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
              className='h-8 text-xs md:text-sm'
            />
          </div>

          <div className='space-y-1'>
            <Label htmlFor='status' className='text-xs'>
              상태
            </Label>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger id='status' className='h-8 text-xs md:text-sm'>
                <SelectValue placeholder='상태 선택' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>전체</SelectItem>
                <SelectItem value='PENDING'>보관중</SelectItem>
                <SelectItem value='RETURNED'>반환됨</SelectItem>
                <SelectItem value='DISCARDED'>폐기됨</SelectItem>
                <SelectItem value='DELETED'>삭제됨</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
