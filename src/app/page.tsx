import { DatePicker } from '@/components/date-picker';
import { HeadacheJournalEntry } from '@/components/headache-journal-entry';
import { HeadacheIcon } from '@/components/icons/headache';

export default function Home() {
  return (
    // Center the title and the icon with large text
    <div className="fjustify-center flex h-full flex-1 flex-col items-center py-2">
      <div className="flex flex-row items-center justify-center">
        <HeadacheIcon className="h-72 w-72 text-red-500" />
        <h1 className="text-6xl font-bold">
          Welcome to the Headache Journal for Jason
        </h1>
      </div>
      <div className="mt-3 flex flex-row items-center justify-center gap-3 align-middle">
        <p className="text-xl">
          Please select a date range to view the headache journal entries
        </p>
        <DatePicker />
      </div>
    </div>
  );
}
