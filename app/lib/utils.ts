import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ZodError } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateRemainingDaysAndDate(createdAt: Date, durationInDays: number) {
  const today = new Date();
  const targetDate = new Date(createdAt.getTime() + durationInDays * 24 * 60 * 60 * 1000);
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
      Object.entries(error.errors).map(([_, value]) => {
        return [value.path[0], value.message];
      }),
    );
  }
  return error;
}
