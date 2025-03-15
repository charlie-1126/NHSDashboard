'use client';
import { CalendarIcon, MapPinIcon, ClockIcon } from 'lucide-react';

type Feature = {
  title: string;
  dateAcquired: string;
  location: string;
  disposalDate: string;
  image: string;
};

interface LNFCardProps {
  feature: Feature;
}

export function LNFCard({ feature }: LNFCardProps) {
  // Format dates to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  // Calculate days remaining until disposal
  const getDaysRemaining = () => {
    const today = new Date();
    const disposalDate = new Date(feature.disposalDate);
    const diffTime = disposalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className='border-border flex h-full flex-grow flex-col overflow-clip rounded-xl border'>
      <div className='relative h-7/10 w-full overflow-hidden'>
        {feature.image ? (
          <img
            src={feature.image || 'public/assets/image/noimg.gif'}
            alt={feature.title}
            className='absolute inset-0 h-full w-full object-cover object-center'
          />
        ) : (
          <img
            src='public/assets/image/noimg.gif'
            alt={feature.title}
            className='absolute inset-0 h-full w-full object-cover object-center'
          />
        )}
      </div>
      <div className='flex-grow px-5 py-2.5'>
        <h3 className='mb-1 text-lg font-semibold md:text-xl'>{feature.title}</h3>
        <div className='text-muted-foreground space-y-1 text-base'>
          <p className='flex items-center justify-between'>
            <CalendarIcon className='mr-1.5 h-3.5 w-3.5 flex-shrink-0' />
            <span className='flex-grow'>
              <strong>취득 일자:</strong> {formatDate(feature.dateAcquired)}
            </span>
            <MapPinIcon className='mr-1.5 h-3.5 w-3.5 flex-shrink-0' />
            <span className='flex-grow'>
              <strong>취득 장소:</strong> {feature.location}
            </span>
          </p>
          <p className='flex items-center'>
            <ClockIcon className='mr-1.5 h-3.5 w-3.5 flex-shrink-0' />
            <span className={daysRemaining <= 3 ? 'text-red-500' : ''}>
              <strong>폐기 일자:</strong> {formatDate(feature.disposalDate)}
              <span className='ml-1 font-medium'>({daysRemaining}일 남음)</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
