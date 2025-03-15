import { CalendarIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import type { itemTable } from '~/db';
import { formatDate, calculateRemainingDaysAndDate } from '~/lib/utils';

export function LNFDashboardCard({ item }: { item: typeof itemTable.$inferSelect }) {
  const { diffDays, targetDate } = calculateRemainingDaysAndDate(item.createdAt, 7);

  return (
    <div className='border-border flex h-full flex-grow flex-col overflow-clip rounded-xl border'>
      <div className='relative h-7/10 w-full overflow-hidden'>
        <img
          src={item.image?.length ? item.image : '/image/noImg.gif'}
          alt={item.name}
          className='absolute inset-0 h-full w-full object-cover object-center'
        />
      </div>
      <div className='flex-grow px-5 py-2.5'>
        <h3 className='mb-1 pb-1 text-lg font-semibold md:text-xl'>{item.name}</h3>
        <div className='text-muted-foreground space-y-1 text-base'>
          <p className='flex items-center justify-between'>
            <CalendarIcon className='mr-1.5 h-3.5 w-3.5 flex-shrink-0' />
            <span className='flex-grow'>
              <strong>취득 일자:</strong> {formatDate(item.createdAt)}
            </span>
            <MapPinIcon className='mr-1.5 h-3.5 w-3.5 flex-shrink-0' />
            <span className='flex-grow'>
              <strong>취득 장소:</strong> {item.location}
            </span>
          </p>
          <p className='flex items-center'>
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
