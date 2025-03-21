import { CalendarIcon, MapPinIcon, ClockIcon, Trash2 } from 'lucide-react';
import { RiUserReceived2Line, RiUserShared2Line } from 'react-icons/ri';
import { FiBox } from 'react-icons/fi';
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
}

const statusMap = {
  PENDING: '보관중',
  RETURNED: '반환됨',
  DISCARDED: '폐기됨',
  DELETED: '삭제됨',
};

export function LNFMSCard({
  item,
  onDelete,
  onReturn,
  onClick,
  onImageClick,
  className,
  multiple,
}: LNFCardProps) {
  const { diffDays, targetDate } = calculateRemainingDaysAndDate(item.createdAt, item.processedAt);

  return (
    <div
      className={`border-border relative flex h-36 cursor-pointer flex-row overflow-hidden rounded-xl border transition-shadow hover:shadow-lg ${className}`}
    >
      <div className='aspect-square h-full'>
        <img
          src={item.image?.length ? item.image : '/image/noImg.gif'}
          alt={item.name}
          className='inset-0 h-full w-full object-cover object-center'
          onClick={onImageClick}
        />
      </div>
      <div className='flex-grow px-2.5 py-2 md:px-4 md:py-3 md:pr-8' onClick={onClick}>
        <h3 className='mt-1.5 mb-3 text-sm font-semibold md:mt-0 md:mb-2 md:text-lg'>
          {item.name}
        </h3>
        <div className='flex gap-7'>
          <div className='text-muted-foreground space-y-1 text-sm'>
            <p className='flex items-center'>
              <CalendarIcon className='mr-0.5 h-3.5 w-3.5 flex-shrink-0 md:mr-1.5' />
              <span>
                <strong className='hidden md:inline'>취득 일자: </strong>
                {formatDate(item.createdAt)}
              </span>
            </p>
            <p className='flex items-center'>
              <MapPinIcon className='mr-0.5 h-3.5 w-3.5 flex-shrink-0 md:mr-1.5' />
              <span>
                <strong className='hidden md:inline'>취득 장소: </strong>
                {item.location}
              </span>
            </p>
            <p className='flex items-center'>
              <ClockIcon className='mr-0.5 h-3.5 w-3.5 flex-shrink-0 md:mr-1.5' />
              <span className={diffDays <= 3 ? 'text-red-500' : ''}>
                <strong className='hidden md:inline'>폐기 일자: </strong>
                {formatDate(targetDate)}
                <span className='ml-1 hidden font-medium md:inline'>({diffDays}일 남음)</span>
              </span>
            </p>
          </div>
          <div className='text-muted-foreground space-y-1 text-sm'>
            <p className='flex items-center'>
              <RiUserShared2Line className='mr-0.5 h-3.5 w-3.5 flex-shrink-0 md:mr-1.5' />
              <span>
                <strong className='hidden md:inline'>제보자: </strong>
                {item.reporter}
              </span>
            </p>
            <p className='flex items-center'>
              <RiUserReceived2Line className='mr-0.5 h-3.5 w-3.5 flex-shrink-0 md:mr-1.5' />
              <span>
                <strong className='hidden md:inline'>인수자: </strong>
                {item.receiver}
              </span>
            </p>
            <p className='flex items-center'>
              <FiBox className='mr-0.5 h-3.5 w-3.5 flex-shrink-0 md:mr-1.5' />
              <span>
                <strong className='hidden md:inline'>상태: </strong>
                {statusMap[item.status]}
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
        className={`absolute top-1 right-2 cursor-pointer rounded-full p-1.5 text-red-500 transition-colors hover:bg-red-100 md:top-3 md:right-3 ${multiple ? 'invisible' : ''}`}
      >
        <Trash2 size={20} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onReturn();
        }}
        className={`absolute top-1 right-10 cursor-pointer rounded-full p-1.5 text-green-400 transition-colors hover:bg-green-100 md:top-3 md:right-12 ${multiple ? 'invisible' : ''}`}
      >
        <FaCheck size={20} />
      </button>
    </div>
  );
}
