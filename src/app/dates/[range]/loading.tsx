import { HeadacheJournalEntrySkeleton } from '@/components/headache-journal-entry-skeleton';

export default function Loading() {
  return (
    <div className='flex flex-col items-center justify-center gap-8'>
      <HeadacheJournalEntrySkeleton />
    </div>
  );
}
