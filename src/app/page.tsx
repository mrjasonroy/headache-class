import { DatePicker } from '@/components/date-picker';
import { HeadacheJournalEntry } from '@/components/headache-journal-entry';
import { HeadacheIcon } from '@/components/icons/headache';

export default function Home() {
  return (
    // Center the title and the icon with large text
    <div className='flex flex-col items-center h-full flex-1 fjustify-center py-2'>
      <div className='flex flex-row items-center justify-center'>
        <HeadacheIcon className='w-72 h-72 text-red-500' />
        <h1 className='text-6xl font-bold'>Welcome to the Headache Journal for Jason</h1>
      </div>
      <div className='flex flex-row items-center justify-center align-middle gap-3 mt-3'>
        <p className='text-xl'>
          Please select a date range to view the headache journal entries
        </p>
        <DatePicker />
      </div>
    </div>
  );
}
