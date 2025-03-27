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
import { useSearchParams } from 'react-router';

const useDebounce = <T extends unknown[]>(callback: (...args: T) => void, delay: number) => {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = React.useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  return debouncedCallback;
};

export function FilterSection() {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [searchParams, setSearchParams] = useSearchParams();

  const debouncedSetSearchParams = useDebounce((newFilters: Record<string, string>) => {
    setSearchParams(newFilters);
  }, 300);

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
    setFilters(Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  const isFilterApplied = () => Object.keys(filters).length > 0;

  const resetFilters = () => {
    setFilters({});
    setSearchParams({});
  };

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    debouncedSetSearchParams(newFilters);
  };

  return (
    <Card className='gap-0 p-0'>
      <CardTitle
        className='px-3 py-1 md:py-2'
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        <div className='flex items-center justify-between'>
          <h3 className='text-base'>{isFilterApplied() ? 'Filter *' : 'Filter'}</h3>
          <div className='flex gap-0 md:gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={(e) => {
                e.stopPropagation();
                resetFilters();
              }}
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
              name='name'
              placeholder='이름 검색'
              value={filters.name || ''}
              onChange={(e) => handleFilterChange({ ...filters, name: e.target.value })}
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
                  name='date-from'
                  variant='outline'
                  className='h-8 w-full justify-start text-left text-xs font-normal md:text-sm'
                >
                  <CalendarIcon className='mr-2 h-3.5 w-3.5' />
                  {filters.startDate ? (
                    format(
                      new Date(filters.startDate),
                      isMobile ? 'yyyy/MM/dd' : 'yyyy년 MM월 dd일',
                      {
                        locale: ko,
                      },
                    )
                  ) : (
                    <span>날짜 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={filters.startDate ? new Date(filters.startDate) : undefined}
                  onSelect={(date) =>
                    handleFilterChange({
                      ...filters,
                      startDate: date ? date.toISOString() : new Date().toISOString(),
                    })
                  }
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
                  name='date-to'
                  variant='outline'
                  className='h-8 w-full justify-start text-left text-xs font-normal md:text-sm'
                >
                  <CalendarIcon className='mr-2 h-3.5 w-3.5' />
                  {filters.endDate ? (
                    format(
                      new Date(filters.endDate),
                      isMobile ? 'yyyy/MM/dd' : 'yyyy년 MM월 dd일',
                      {
                        locale: ko,
                      },
                    )
                  ) : (
                    <span>날짜 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <Calendar
                  mode='single'
                  selected={filters.endDate ? new Date(filters.endDate) : undefined}
                  onSelect={(date) =>
                    handleFilterChange({
                      ...filters,
                      endDate: date ? date.toISOString() : new Date().toISOString(),
                    })
                  }
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
              name='reporter'
              placeholder='제보자 검색'
              value={filters.reporter || ''}
              onChange={(e) => handleFilterChange({ ...filters, reporter: e.target.value })}
              className='h-8 text-xs md:text-sm'
            />
          </div>

          <div className='space-y-1'>
            <Label htmlFor='receiver' className='text-xs'>
              인수자
            </Label>
            <Input
              name='receiver'
              placeholder='인수자 검색'
              value={filters.receiver || ''}
              onChange={(e) => handleFilterChange({ ...filters, receiver: e.target.value })}
              className='h-8 text-xs md:text-sm'
            />
          </div>

          <div className='space-y-1'>
            <Label htmlFor='location' className='text-xs'>
              위치
            </Label>
            <Input
              name='location'
              placeholder='위치 검색'
              value={filters.location || ''}
              onChange={(e) => handleFilterChange({ ...filters, location: e.target.value })}
              className='h-8 text-xs md:text-sm'
            />
          </div>

          <div className='space-y-1'>
            <Label htmlFor='status' className='text-xs'>
              상태
            </Label>
            <Select
              value={filters.status || 'PENDING'}
              onValueChange={(value) => handleFilterChange({ ...filters, status: value })}
            >
              <SelectTrigger id='status' className='h-8 text-xs md:text-sm'>
                <SelectValue placeholder='상태 선택' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>전체</SelectItem>
                <SelectItem value='PENDING'>보관중</SelectItem>
                <SelectItem value='RETURNED'>반환됨</SelectItem>
                <SelectItem value='DISCARDED'>폐기됨</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
