'use client';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDaysIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { useRouter } from 'next/navigation';
import { cn, createDateRangeUrlString } from '@/lib/utils';
import { useState, useTransition } from 'react';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { IconSpinner } from './icons/spinner';
dayjs.extend(utc);

export function DatePicker(props: {
  selectedDates?: {
    from: Date;
    to?: Date;
  };
  variant?: 'default' | 'secondary' | 'destructive';
}) {
  const router = useRouter();
  const [isLoading, startDateTransition] = useTransition();
  const [isValidDateRange, setIsValidDateRange] = useState<boolean>(true);
  const [selectedDates, setSelectedDates] = useState<
    | {
        from: Date;
        to?: Date;
      }
    | undefined
  >(props.selectedDates);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={props.variant || 'default'}
          className='flex items-center gap-2'
        >
          <CalendarDaysIcon className='w-4 h-4' />
          <span>Select Date(s)</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-auto p-0'
        align='end'
      >
        <div className='flex items-center flex-col justify-center p-4 gap-2'>
          <Calendar
            mode='range'
            initialFocus
            selected={selectedDates}
            onSelect={(dates: DateRange | undefined) => {
              if (!dates || !dates.from) return;
              setIsValidDateRange(true);
              setSelectedDates({
                from: dates.from,
                to: dates.to,
              });
            }}
          />
          <div
            className={cn('w-full text-red-600 hidden', {
              block: !isValidDateRange,
            })}
          >
            Invalid Date Range
          </div>
          <div className='flex gap-2 justify-end w-full'>
            <Button
              variant='secondary'
              onClick={() => {
                setSelectedDates(undefined);
                setIsValidDateRange(true);
              }}
            >
              Clear
            </Button>
            <Button
              variant='default'
              onClick={() => {
                if (selectedDates?.from) {
                  startDateTransition(() => {
                    router.push(
                      '/dates/' +
                        createDateRangeUrlString({
                          from: selectedDates.from,
                          to: selectedDates.to,
                        })
                    );
                  });
                } else {
                  setIsValidDateRange(false);
                }
              }}
            >
              Confirm <IconSpinner className={cn('w-4 h-4 hidden', { block: isLoading })} />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
