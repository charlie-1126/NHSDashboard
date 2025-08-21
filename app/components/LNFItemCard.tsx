import { CalendarIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import type { itemTable } from '~/db';
import { formatDate, calculateRemainingDaysAndDate } from '~/lib/utils';
import { cn } from '~/lib/utils';

export interface LNFItemCardProps {
  item: typeof itemTable.$inferSelect;
  variant?: 'dashboard' | 'home';
  onClick?: () => void;
  className?: string;
}

export function LNFItemCard({ item, variant = 'home', onClick, className }: LNFItemCardProps) {
  const { diffDays, targetDate } = calculateRemainingDaysAndDate(item.createdAt, item.processedAt);
  const danger = diffDays <= 3;

  const aspectClass = variant === 'dashboard' ? 'aspect-video' : 'aspect-square';
  const headingClass =
    variant === 'dashboard'
      ? 'mb-3 line-clamp-1 text-lg font-bold tracking-tight xl:text-xl 2xl:text-2xl'
      : 'mb-2 line-clamp-1 text-base font-semibold tracking-tight md:text-lg';
  const metaTextClass =
    variant === 'dashboard' ? 'text-[12.5px] xl:text-sm 2xl:text-base' : 'text-[11.5px] md:text-sm';

  return (
    <div
      className={cn(
        'group border-border/70 bg-card/60 focus-visible:ring-ring relative flex h-full flex-col overflow-hidden rounded-xl border shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none',
        onClick && 'cursor-pointer',
        className,
      )}
      role='article'
      tabIndex={0}
      aria-label={`분실물 ${item.name}`}
      onClick={onClick}
    >
      <div className={cn('relative w-full overflow-hidden', aspectClass)}>
        <img
          src={item.image?.length ? item.image : '/image/noImg.gif'}
          alt={item.name}
          loading='lazy'
          className='h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105'
        />
      </div>
      <div className='flex flex-1 flex-col px-2.5 py-2 2xl:px-5 2xl:py-4'>
        <h3 className={headingClass}>{item.name}</h3>
        <div className={cn('text-muted-foreground space-y-1.5 font-bold', metaTextClass)}>
          <p className='flex items-center gap-1.5'>
            <CalendarIcon className='text-primary/70 h-3.5 w-3.5' />
            <span>
              <strong className='text-foreground/80 text-xs xl:text-sm 2xl:text-xl'>
                습득 일시: {formatDate(item.createdAt)}
              </strong>
            </span>
          </p>
          <p className='flex items-center gap-1.5'>
            <MapPinIcon className='text-primary/70 h-3.5 w-3.5' />
            <span>
              <strong className='text-foreground/80 text-xs xl:text-sm 2xl:text-xl'>
                습득 위치: {item.location}
              </strong>
            </span>
          </p>
          <p className='flex items-center gap-1.5'>
            <ClockIcon className='text-primary/70 h-3.5 w-3.5' />
            <span className={danger ? 'font-semibold text-red-500' : ''}>
              <strong className='text-foreground/80 text-xs xl:text-sm 2xl:text-xl'>
                폐기 일시: {formatDate(targetDate)} ({diffDays}일)
              </strong>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LNFItemCard;
