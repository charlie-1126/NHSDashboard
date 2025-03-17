import { CalendarIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import type { itemTable } from '~/db';
import { formatDate, calculateRemainingDaysAndDate } from '~/lib/utils';

interface LNFDashboardCardProps {
  item: typeof itemTable.$inferSelect;
  onClick: () => void;
}

export function LNFHomeCard({ item, onClick }: LNFDashboardCardProps) {
  const { diffDays, targetDate } = calculateRemainingDaysAndDate(item.createdAt, item.processedAt);

  return (
    <div
      className='border-border flex h-full flex-grow cursor-pointer flex-col overflow-hidden rounded-xl border hover:shadow-lg'
      onClick={onClick}
    >
      <div className='relative aspect-square w-full overflow-hidden'>
        <img
          src={item.image?.length ? item.image : '/image/noImg.gif'}
          alt={item.name}
          className='h-full w-full object-cover'
        />
      </div>
      <div className='flex-grow px-5 py-2.5'>
        <h3 className='mb-1 pb-1 text-lg font-semibold md:text-xl'>{item.name}</h3>
        <div className='text-muted-foreground space-y-1 text-base'>
          <p className='flex items-center'>
            <CalendarIcon className='mr-1.5 h-3.5 w-3.5 flex-shrink-0' />
            <span>
              <strong>취득 일자:</strong> {formatDate(item.createdAt)}
            </span>
          </p>
          <p className='flex items-center'>
            <MapPinIcon className='mr-1.5 h-3.5 w-3.5 flex-shrink-0' />
            <span>
              <strong>취득 장소:</strong> {item.location}
            </span>
          </p>
          <p className='flex items-center pb-1'>
            <ClockIcon className='mr-1.5 h-3.5 w-3.5 flex-shrink-0' />
            <span className={diffDays <= 3 ? 'text-red-500' : ''}>
              <strong>폐기 일자:</strong> {formatDate(targetDate)}
              <span className='ml-1 font-medium'>({diffDays}일 남음)</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
