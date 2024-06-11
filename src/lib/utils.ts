import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createDateRangeUrlString({
  from,
  to,
}: {
  from: Date;
  to?: Date;
}) {
  const dateStrings = [dayjs(from).format('YYYY-MM-DD')];
  if (to) {
    dateStrings.push(dayjs(to).format('YYYY-MM-DD'));
  }
  return dateStrings.join(',');
}
export function parseDateRangeUrlString(dateRange: string): {
  from: Date;
  to?: Date;
} {
  const dateRanageString = decodeURIComponent(dateRange);

  const [from, to] = dateRanageString
    .split(',')
    .map((date) => dayjs(date).toDate());
  return { from, to };
}
export function getHoursAndMinutesFromDate(date: Date) {
  return dayjs(date).format('HH:mm');
}
