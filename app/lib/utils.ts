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
