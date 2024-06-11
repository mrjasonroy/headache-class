import { Skeleton } from './ui/skeleton';

export function HeadacheJournalEntrySkeleton() {
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="mb-4 flex justify-between">
          <div>
            <label
              htmlFor="day"
              className="block text-sm font-medium text-gray-700"
            >
              Day:
            </label>
            <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 shadow-sm">
              <Skeleton />
            </div>
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date:
            </label>
            <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 shadow-sm">
              <Skeleton />
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="border-t py-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pain Level</h3>
          </div>
          <div className="h-[300px] w-full bg-gray-200">
            <svg width="400" height="110" className="h-full w-full">
              <polyline
                points="0,100 40,60 80,80 120,20 160,80 200,60 240,100 280,40 320,60 360,20 400,40"
                style={{ fill: 'none', stroke: 'darkgray', strokeWidth: 2 }}
              />
            </svg>
          </div>
        </div>
        <div className="my-4">
          <label
            htmlFor="actions-table"
            className="block text-sm font-medium text-gray-700"
          >
            Actions Taken:
          </label>
          <div className="mt-1 w-full overflow-auto">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                      Time
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                      Medications
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 [&:has([role=checkbox])]:pr-0">
                      Remedies
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  <tr className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                      <Skeleton />
                    </td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                      <Skeleton />
                    </td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                      <Skeleton />
                    </td>
                  </tr>
                  <tr className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800">
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                      <Skeleton />
                    </td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                      <Skeleton />
                    </td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                      <Skeleton />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div
          data-orientation="horizontal"
          role="none"
          className="my-4 h-[1px] w-full shrink-0 bg-gray-200 dark:bg-gray-800"
        ></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Notes:
            </label>
            <div className="prose mt-1 block w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 shadow-sm">
              <Skeleton />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Risk Factors and Triggers:
            </label>
            <div className="mt-1 border-t pt-2">
              {[
                'diet',
                'emotion',
                'sleep',
                'intensity',
                'body use',
                'external',
                'other',
              ].map((factor) => (
                <div
                  key={factor}
                  className="mb-2 flex items-center justify-between border-b pb-2"
                >
                  <span className="text-sm capitalize">{factor}</span>
                  <div className="flex space-x-2">
                    {['Low', 'Med', 'High'].map((level) => (
                      <Skeleton
                        key={level}
                        className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-medium ring-offset-white transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
