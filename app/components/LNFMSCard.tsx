import { CalendarIcon, MapPinIcon, ClockIcon, Trash2 } from 'lucide-react';
import { RiUserReceived2Line, RiUserShared2Line } from 'react-icons/ri';
import { FaCheck } from 'react-icons/fa6';
import type { itemTable } from '~/db';
import { calculateRemainingDaysAndDate, formatDate } from '~/lib/utils';

interface LNFCardProps {
  item: typeof itemTable.$inferSelect;
  onDelete: () => void;
  onReturn: () => void;
  onClick?: () => void;
  onImageClick?: () => void;
  className?: string;
  multiple?: boolean;
  selected?: boolean;
  index?: number;
}

const statusMap = {
  PENDING: '보관중',
  RETURNED: '반환됨',
  DISCARDED: '폐기됨',
  DELETED: '삭제됨',
};

const statusClass: Record<string, string> = {
  PENDING: 'text-amber-600 dark:text-amber-500',
  RETURNED: 'text-emerald-600 dark:text-emerald-500',
  DISCARDED: 'text-rose-600 dark:text-rose-500',
  DELETED: 'text-gray-500 line-through',
};

export function LNFMSCard({
  item,
  onDelete,
  onReturn,
  onClick,
  onImageClick,
  className = '',
  multiple,
  selected,
  index,
}: LNFCardProps) {
  const { diffDays, targetDate } = calculateRemainingDaysAndDate(item.createdAt, item.processedAt);

  // 상단 뱃지 대신 본문 내부에 상태 텍스트만 표시하도록 변경

  const danger = diffDays <= 3 && item.status === 'PENDING';

  return (
    <div
      role='button'
      tabIndex={0}
      aria-label={`분실물 ${item.name}`}
      aria-selected={selected}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`group relative flex h-40 overflow-hidden rounded-xl border text-sm transition-colors duration-300 select-none md:h-36 ${
        selected
          ? 'border-primary/40 ring-primary/50 bg-primary/5 shadow-sm ring-2'
          : 'border-border/40 bg-background/70 hover:bg-background/80 shadow-sm'
      } ${index !== undefined && index % 2 === 1 && !selected ? 'bg-background/50' : ''} ${className}`}
    >
      <div className='relative aspect-square h-full flex-shrink-0'>
        <img
          src={item.image?.length ? item.image : '/image/noImg.gif'}
          alt={`${item.name} 이미지`}
          className='h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105'
          onClick={(e) => {
            e.stopPropagation();
            onImageClick?.();
          }}
        />
        {/* D-day 배지 제거 (요청) */}
      </div>
      <div className='flex flex-1 flex-col px-3 py-2 pr-10 md:px-4 md:py-3'>
        <div className='mb-1 flex items-start justify-between gap-2 pr-2'>
          <h3 className='line-clamp-1 text-base font-semibold md:text-lg'>{item.name}</h3>
        </div>
        <div className='grid flex-1 grid-cols-2 gap-x-6 gap-y-1.5'>
          <div className='space-y-1'>
            <p className='flex items-center gap-1'>
              <CalendarIcon className='h-3.5 w-3.5 flex-shrink-0 opacity-70' />
              <span className='truncate'>{formatDate(item.createdAt)}</span>
            </p>
            <p className='flex items-center gap-1'>
              <MapPinIcon className='h-3.5 w-3.5 flex-shrink-0 opacity-70' />
              <span className='truncate'>{item.location}</span>
            </p>
            <p className='flex items-center gap-1'>
              <ClockIcon className='h-3.5 w-3.5 flex-shrink-0 opacity-70' />
              <span className={`${danger ? 'font-medium text-red-500' : ''}`}>
                {formatDate(targetDate)}
                <span className='text-muted-foreground ml-1 hidden text-xs md:inline'>
                  ({diffDays}일)
                </span>
              </span>
            </p>
          </div>
          <div className='space-y-1'>
            <p className='flex items-center gap-1'>
              <RiUserShared2Line className='h-3.5 w-3.5 flex-shrink-0 opacity-70' />
              <span className='truncate'>{item.reporter}</span>
            </p>
            <p className='flex items-center gap-1'>
              <RiUserReceived2Line className='h-3.5 w-3.5 flex-shrink-0 opacity-70' />
              <span className='truncate'>{item.receiver ?? '-'}</span>
            </p>
            <p className={`flex items-center gap-1 ${statusClass[item.status]}`}>
              <span
                className={`inline-block h-2 w-2 flex-shrink-0 rounded-full shadow-inner ${
                  item.status === 'PENDING'
                    ? 'bg-amber-500'
                    : item.status === 'RETURNED'
                      ? 'bg-emerald-500'
                      : item.status === 'DISCARDED'
                        ? 'bg-rose-500'
                        : 'bg-gray-400'
                }`}
              />
              <span className='truncate font-medium tracking-tight'>{statusMap[item.status]}</span>
            </p>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div
        className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity ${
          multiple ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReturn();
          }}
          className='focus-visible:ring-ring flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/90 text-white shadow transition-colors hover:bg-emerald-500 focus-visible:ring-2 focus-visible:outline-none'
          aria-label='반환'
        >
          <FaCheck size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className='focus-visible:ring-ring flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/90 text-white shadow transition-colors hover:bg-rose-500 focus-visible:ring-2 focus-visible:outline-none'
          aria-label='폐기'
        >
          <Trash2 size={16} />
        </button>
      </div>
      {selected && (
        <span className='bg-primary/10 animate-in fade-in pointer-events-none absolute inset-0' />
      )}
    </div>
  );
}
