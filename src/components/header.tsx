import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DatePicker } from './date-picker';
import { HeadacheIcon } from './icons/headache';
import Link from 'next/link';
dayjs.extend(utc);

export function Header({
  selectedDates,
}: {
  selectedDates?: {
    from: Date;
    to?: Date;
  };
}) {
  return (
    <header className="no-print sticky top-0 z-50 mb-8 gap-2 bg-white shadow-md">
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
                    {`${dayjs(selectedDates?.from).format('MMMM D, YYYY')}${
                      (selectedDates?.to &&
                        ` to ${dayjs.utc(selectedDates?.to).format('MMMM D, YYYY')}`) ||
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
