import { HeadacheJournalEntry } from '@/components/headache-journal-entry';
import { Header } from '@/components/header';
import { getJournalEntries } from '@/lib/journal-entries';
import { parseDateRangeUrlString } from '@/lib/utils';
import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: {
    range: string;
  };
}) {
  const dates = parseDateRangeUrlString(params.range);
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/dates/${params.range}`);
  }
  const journalEntries = await getJournalEntries({
    from: dates.from,
    to: dates.to,
  });

  if (!journalEntries) {
    return null;
  }
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <>
        {Object.keys(journalEntries).map((date) => {
          if (!journalEntries[date]) {
            return null;
          }
          return (
            <>
              <HeadacheJournalEntry
                key={date}
                painData={journalEntries[date].painData}
                date={journalEntries[date].date}
                notes={journalEntries[date].notes}
                riskFactors={journalEntries[date].riskFactors}
                lineChartData={journalEntries[date].lineChartData}
              />
            </>
          );
        })}
      </>
    </div>
  );
}
