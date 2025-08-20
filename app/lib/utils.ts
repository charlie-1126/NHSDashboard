import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ZodError } from 'zod';
import { add } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateRemainingDaysAndDate(createdAt: Date, processedAt: Date | null) {
  const today = new Date();
  let targetDate;
  if (processedAt) {
    targetDate = new Date(processedAt.getTime());
  } else {
    targetDate = add(new Date(createdAt), { months: 1 });
  }
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return { diffDays, targetDate };
}

/**
 * 1개월(획득일 + 1달)을 만료 기준으로 남은 퍼센트를 0~100 사이 값으로 반환.
 * 이미 처리(processedAt)된 경우 만료일=processedAt 으로 계산.
 */
export function calculateRemainingPercent(createdAt: Date, processedAt: Date | null) {
  const end = processedAt ? new Date(processedAt) : add(new Date(createdAt), { months: 1 });
  const total = end.getTime() - new Date(createdAt).getTime();
  const remain = end.getTime() - Date.now();
  if (total <= 0) return 0;
  const percent = (remain / total) * 100;
  return Math.min(100, Math.max(0, Math.round(percent)));
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export function beautifyZodError(error: ZodError) {
  if (error?.errors) {
    return Object.fromEntries(
      Object.entries(error.errors).map(([, value]) => {
        return [value.path[0], value.message];
      }),
    );
  }
  return error;
}
