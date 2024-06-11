import { Skeleton } from './ui/skeleton';

export function HeadacheJournalEntrySkeleton() {
  return (
    <div className='w-full rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50'>
      <div className='flex flex-col space-y-1.5 p-6'>
        <div className='flex justify-between mb-4'>
          <div>
            <label
              htmlFor='day'
              className='block text-sm font-medium text-gray-700'
            >
              Day:
            </label>
            <div className='mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 bg-gray-100'>
              <Skeleton />
            </div>
          </div>
          <div>
            <label
              htmlFor='date'
              className='block text-sm font-medium text-gray-700'
            >
              Date:
            </label>
            <div className='mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 bg-gray-100'>
              <Skeleton />
            </div>
          </div>
        </div>
      </div>
      <div className='p-6 pt-0'>
        <div className='border-t py-4'>
          <div className='mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>Pain Level</h3>
          </div>
          <div className='w-full h-[300px] bg-gray-200'>
            <svg
              width='400'
              height='110'
              className='w-full h-full'
            >
              <polyline
                points='0,100 40,60 80,80 120,20 160,80 200,60 240,100 280,40 320,60 360,20 400,40'
                style={{ fill: 'none', stroke: 'darkgray', strokeWidth: 2 }}
              />
            </svg>
          </div>
        </div>
        <div className='my-4'>
          <label
            htmlFor='actions-table'
            className='block text-sm font-medium text-gray-700'
          >
            Actions Taken:
          </label>
          <div className='mt-1 w-full overflow-auto'>
            <div className='relative w-full overflow-auto'>
              <table className='w-full caption-bottom text-sm'>
                <thead className='[&_tr]:border-b'>
                  <tr className='border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800'>
                    <th className='h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 dark:text-gray-400'>
                      Time
                    </th>
                    <th className='h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 dark:text-gray-400'>
                      Medications
                    </th>
                    <th className='h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 dark:text-gray-400'>
                      Remedies
                    </th>
                  </tr>
                </thead>
                <tbody className='[&_tr:last-child]:border-0'>
                  <tr className='border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800'>
                    <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0'>
                      <Skeleton />
                    </td>
                    <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0'>
                      <Skeleton />
                    </td>
                    <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0'>
                      <Skeleton />
                    </td>
                  </tr>
                  <tr className='border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800'>
                    <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0'>
                      <Skeleton />
                    </td>
                    <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0'>
                      <Skeleton />
                    </td>
                    <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0'>
                      <Skeleton />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div
          data-orientation='horizontal'
          role='none'
          className='shrink-0 bg-gray-200 dark:bg-gray-800 h-[1px] w-full my-4'
        ></div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <label
              htmlFor='notes'
              className='block text-sm font-medium text-gray-700'
            >
              Notes:
            </label>
            <div className='mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 bg-gray-100 prose'>
              <Skeleton />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Risk Factors and Triggers:
            </label>
            <div className='mt-1 border-t pt-2'>
              {['diet', 'emotion', 'sleep', 'intensity', 'body use', 'external', 'other'].map(
                (factor) => (
                  <div
                    key={factor}
                    className='flex items-center justify-between mb-2 border-b pb-2'
                  >
                    <span className='text-sm capitalize'>{factor}</span>
                    <div className='flex space-x-2'>
                      {['Low', 'Med', 'High'].map((level) => (
                        <Skeleton
                          key={level}
                          className='inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 h-10 px-4 py-2 text-xs'
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
