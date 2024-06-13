'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { ResponsiveLine } from '@nivo/line';
import { Separator } from './ui/separator';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
import { JournalEntry } from '@/lib/journal-entries';
import { Card, CardContent, CardHeader } from './ui/card';

export function HeadacheJournalEntry(props: JournalEntry) {
  return (
    <div className="w-full break-after-page">
      <Card className="w-full">
        <CardHeader>
          <div className="mb-4 flex justify-between">
            <div>
              <label
                htmlFor="day"
                className="block text-sm font-medium text-gray-700"
              >
                Day:
              </label>
              <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 shadow-sm">
                {dayjs.tz(props.date, 'America/Los_Angeles').format('dddd')}
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
                {dayjs.tz(props.date, 'America/Los_Angeles').format('MMMM D, YYYY')}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-t py-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Pain Level
              </h3>
            </div>
            <LineChart className="h-[300px] w-full" data={props.lineChartData} />
          </div>
          <div className="my-4">
            <label
              htmlFor="actions-table"
              className="block text-sm font-medium text-gray-700"
            >
              Actions Taken:
            </label>
            <div className="mt-1 w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Medications</TableHead>
                    <TableHead>Remedies</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {props.painData
                    .filter(
                      (data) =>
                        data.medications.length > 0 || data.remedies.length > 0
                    )
                    .map((data) => (
                      <TableRow key={data.time.toISOString()}>
                        <TableCell>
                          {dayjs.tz(data.time, 'America/Los_Angeles').format('hh:mm A')}
                        </TableCell>
                        <TableCell>{data.medications.join(', ')}</TableCell>
                        <TableCell>{data.remedies.join(', ')}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Notes:
              </label>
              <div className="prose mt-1 block w-full rounded-md border-gray-300 bg-gray-100 px-3 py-2 shadow-sm">
                <ul>
                  {props.notes.map((note) => (
                    <li key={note.time.toISOString()} className="mb-2">
                      <span className="font-semibold">
                        {dayjs.tz(note.time, 'America/Los_Angeles').format('hh:mm A')}
                      </span>{' '}
                      {note.note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Risk Factors and Triggers:
              </label>
              <div className="mt-1 border-t pt-2">
                {Object.entries(props.riskFactors).map(
                  ([category, factors]) => (
                    <div
                      key={category}
                      className="mb-2 flex items-center justify-between border-b pb-2"
                    >
                      <span className="text-sm capitalize">{category}</span>
                      <div className="flex space-x-2">
                        <Button
                          variant={
                            factors.toLocaleLowerCase() === 'low'
                              ? 'default'
                              : 'outline'
                          }
                          className="text-xs"
                        >
                          Low
                        </Button>
                        <Button
                          variant={
                            factors.toLocaleLowerCase() === 'med'
                              ? 'default'
                              : 'outline'
                          }
                          className="text-xs"
                        >
                          Med
                        </Button>
                        <Button
                          variant={
                            factors.toLocaleLowerCase() === 'high'
                              ? 'default'
                              : 'outline'
                          }
                          className="text-xs"
                        >
                          High
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LineChart(props: {
  data: { x: string; y: number; medications: string[]; remedies: string[] }[];
  className?: string;
}) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: 'Pain Level',
            data: props.data,
          },
        ]}
        enableArea={true}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: 'time',
          format: '%H:%M:%S',
          useUTC: false,
          precision: 'hour',
          min: '06:00:00',
          max: '23:00:00',
        }}
        xFormat="time:%H"
        yScale={{
          type: 'linear',
          min: 0,
          max: 10,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          format: (value) => dayjs(value).format('hh:mm A'),
          legendOffset: -12,
          tickValues: 'every 2 hours',
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        // light red
        colors={['#FF0000']}
        lineWidth={3}
        pointSize={10}
        useMesh={true}
        gridYValues={6}
        tooltip={({ point }) => {
          const data = point.data as {
            x: string;
            y: number;
            medications?: string[];
            remedies?: string[];
          };
          return (
            <div className="min-w-44 rounded-md border bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <span>{dayjs(point.data.x).format('hh:mm A')}</span>
                <span className="font-bold">{data.y} / 10</span>
              </div>
              <>
                {data.medications && data.medications?.length > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <span className="font-bold">Medications:</span>
                    <span>{data.medications?.join(', ')}</span>
                  </div>
                )}
              </>
              {data.remedies && data.remedies.length > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-bold">Remedies:</span>
                  <span>{data.remedies.join(', ')}</span>
                </div>
              )}
            </div>
          );
        }}
        theme={{
          tooltip: {
            chip: {
              borderRadius: '9999px',
            },
            container: {
              fontSize: '12px',
              textTransform: 'capitalize',
              borderRadius: '6px',
            },
          },
          grid: {
            line: {
              stroke: '#f3f4f6',
            },
          },
        }}
        role="application"
      />
    </div>
  );
}
