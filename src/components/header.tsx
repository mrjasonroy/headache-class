import { DatePicker } from './date-picker';
import { HeadacheIcon } from './icons/headache';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);

export function Header({
  selectedDates,
  className,
}: {
  selectedDates?: {
    from: Date;
    to?: Date;
  };
  className?: string;
}) {
  return (
    <header
      className={cn(
        'no-print sticky top-0 z-50 gap-2 bg-white shadow-md',
        className
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4">
        <div className="flex items-center justify-start gap-4">
          <Link href="/">
            <HeadacheIcon className="h-16 w-16 text-red-500" />
          </Link>
          <div className="align-middle">
            <h2 className="text-2xl font-bold">
              Kaiser Headache Class Journal Entries for Jason
            </h2>
            <>
              {selectedDates && (
                <p className="text-sm text-gray-500">
                  This is a list of all the headache journal entries for Jason
                  for the dates{' '}
                  <span className="font-semibold italic">
                    {`${dayjs.tz(selectedDates?.from, 'America/Los_Angeles').format('MMMM D, YYYY')}${
                      (selectedDates?.to &&
                        ` to ${dayjs.tz(selectedDates?.to, 'America/Los_Angeles').format('MMMM D, YYYY')}`) ||
                      ''
                    }`}
                  </span>
                </p>
              )}
            </>
          </div>
        </div>
        <DatePicker selectedDates={selectedDates} />
      </div>
    </header>
  );
}
