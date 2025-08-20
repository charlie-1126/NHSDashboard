import { CalendarIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import type { itemTable } from '~/db';
import { formatDate, calculateRemainingDaysAndDate } from '~/lib/utils';

interface Props {
  item: typeof itemTable.$inferSelect;
}

/**
 * 시각 향상 버전 분실물 카드.
 * - 이미지 오버레이 + 위치/취득일 표시
 * - 남은 기간 퍼센트 프로그레스 바
 * - 3일 이하 경고 색상
 */
export function LNFCardModern({ item }: Props) {
  const { diffDays, targetDate } = calculateRemainingDaysAndDate(item.createdAt, item.processedAt);
  const danger = diffDays <= 3;

  return (
    <div className='group border-border/70 bg-card/60 relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg'>
      {/* Image */}
      <div className='relative aspect-video w-full overflow-hidden'>
        <img
          src={item.image?.length ? item.image : '/image/noImg.gif'}
          alt={item.name}
          loading='lazy'
          className='h-full w-full scale-105 object-cover object-center transition-transform duration-700 group-hover:scale-110'
        />
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-90 mix-blend-multiply transition-opacity group-hover:opacity-95' />
        <div className='absolute right-3 bottom-2 left-3 flex items-end justify-between text-xs font-medium text-white/90 drop-shadow-sm'>
          <span className='line-clamp-1'>{item.location}</span>
          <span>{formatDate(item.createdAt)}</span>
        </div>
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col px-4 py-3'>
        <h3 className='mb-2 line-clamp-1 text-base font-semibold tracking-tight md:text-lg'>
          {item.name}
        </h3>
        <div className='text-muted-foreground space-y-1.5 text-xs md:text-sm'>
          <p className='flex items-center gap-1.5'>
            <CalendarIcon className='text-primary/70 h-3.5 w-3.5' />
            <span>
              <strong className='text-foreground/80 font-semibold'>취득</strong>:{' '}
              {formatDate(item.createdAt)}
            </span>
          </p>
          <p className='flex items-center gap-1.5'>
            <MapPinIcon className='text-primary/70 h-3.5 w-3.5' />
            <span>
              <strong className='text-foreground/80 font-semibold'>위치</strong>: {item.location}
            </span>
          </p>
          <p className='flex items-center gap-1.5'>
            <ClockIcon className='text-primary/70 h-3.5 w-3.5' />
            <span className={danger ? 'font-semibold text-red-500' : ''}>
              <strong className='text-foreground/80 font-semibold'>폐기</strong>:{' '}
              {formatDate(targetDate)} ({diffDays}일)
            </span>
          </p>
        </div>
        <div className='bg-muted/70 mt-3 h-2 w-full overflow-hidden rounded-full'>
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              danger
                ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400'
                : 'bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400'
            }`}
          />
        </div>
      </div>

      {/* Light overlay hover */}
      <div className='pointer-events-none absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-5' />
    </div>
  );
}

export default LNFCardModern;
