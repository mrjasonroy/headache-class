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
    <header className=' mb-8 sticky top-0 bg-white shadow-md z-50 gap-2 no-print'>
      <div className='max-w-5xl mx-auto p-4 flex justify-between gap-4 items-center'>
        <div className='flex justify-start gap-4 items-center'>
          <Link href='/'>
            <HeadacheIcon className='w-16 h-16 text-red-500' />
          </Link>
          <div className='align-middle'>
            <h2 className='text-2xl font-bold'>Kaiser Headache Class Journal Entries for Jason</h2>
            <>
              {selectedDates && (
                <p className='text-gray-500 text-sm'>
                  This is a list of all the headache journal entries for Jason for the dates{' '}
                  <span className='font-semibold italic'>
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
