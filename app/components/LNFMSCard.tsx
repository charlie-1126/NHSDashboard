import { CalendarIcon, MapPinIcon, ClockIcon, Trash2 } from 'lucide-react';
import { RiUserReceived2Line, RiUserShared2Line } from 'react-icons/ri';
import type { itemTable } from '~/db';
import { calculateRemainingDaysAndDate, formatDate } from '~/lib/utils';

interface LNFCardProps {
  item: typeof itemTable.$inferSelect;
  onDelete: () => void;
  onClick?: () => void;
  className?: string;
}

const statusMap = {
  PENDING: '대기중',
  RETURNED: '반환됨',
  DISCARDED: '폐기됨',
  DELETED: '삭제됨',
};

export function LNFMSCard({ item, onDelete, onClick, className }: LNFCardProps) {
  const { diffDays, targetDate } = calculateRemainingDaysAndDate(item.createdAt, 7);

  return (
    <div
      className={`border-border relative flex h-36 cursor-pointer flex-row overflow-hidden rounded-xl border transition-shadow hover:shadow-lg ${className}`}
      onClick={onClick}
    >
      <div className='aspect-square h-full'>
        <img
          src={item.image?.length ? item.image : '/image/noImg.gif'}
          alt={item.name}
          className='inset-0 h-full w-full object-cover object-center'
        />
      </div>
      <div className='flex-grow px-4 py-3 pr-8'>
        <h3 className='mb-2 text-lg font-semibold'>{item.name}</h3>
        <div className='flex gap-7'>
          <div className='text-muted-foreground space-y-1 text-sm'>
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
            <p className='flex items-center'>
              <ClockIcon className='mr-1.5 h-3.5 w-3.5 flex-shrink-0' />
              <span className={diffDays <= 3 ? 'text-red-500' : ''}>
                <strong>폐기 일자:</strong> {formatDate(targetDate)}
                <span className='ml-1 font-medium'>({diffDays}일 남음)</span>
              </span>
            </p>
          </div>
          <div className='text-muted-foreground space-y-1 text-sm'>
            <p className='flex items-center'>
              <RiUserShared2Line className='mr-1.5 h-3.5 w-3.5 flex-shrink-0' />
              <span>
                <strong>제보자:</strong> {item.reporter}
              </span>
            </p>
            <p className='flex items-center'>
              <RiUserReceived2Line className='mr-1.5 h-3.5 w-3.5 flex-shrink-0' />
              <span>
                <strong>인수자:</strong> {item.receiver}
              </span>
            </p>
            <p className='flex items-center'>
              <RiUserReceived2Line className='mr-1.5 h-3.5 w-3.5 flex-shrink-0' />
              <span>
                <strong>상태:</strong> {statusMap[item.status]}
              </span>
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className='absolute top-3 right-3 cursor-pointer rounded-full p-1.5 text-red-500 transition-colors hover:bg-red-100'
        aria-label='삭제'
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
