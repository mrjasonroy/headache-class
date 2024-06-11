import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { twMerge } from 'tailwind-merge';

dayjs.extend(utc);
dayjs.extend(timezone);

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
  const dateStrings = [dayjs.tz(from, 'America/Los_Angeles').format('YYYY-MM-DD')];
  if (to) {
    dateStrings.push(dayjs.tz(to, 'America/Los_Angeles').format('YYYY-MM-DD'));
  }
  return dateStrings.join(',');
}

export function parseDateRangeUrlString(dateRange: string): {
  from: Date;
  to?: Date;
} {
  const dateRangeString = decodeURIComponent(dateRange);

  const [from, to] = dateRangeString
    .split(',')
    .map((date) => dayjs.tz(date, 'America/Los_Angeles').startOf('day').toDate());
  return { from, to };
}

export function getHoursAndMinutesFromDate(date: Date) {
  return dayjs.tz(date, 'America/Los_Angeles').format('HH:mm');
}
