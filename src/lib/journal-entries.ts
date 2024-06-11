import { promises as fs } from 'fs';
import { FormDefinitionSchema } from './schemas/form-definition';
import { FormResponsesSchema } from './schemas/form-responses';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import { getFormDefinition } from './form-definition';
import { getFormResponses } from './form-responses';
import { getAuth } from './auth';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

export type JournalEntry = {
  date: Date;
  painData: {
    time: Date;
    level: number | null;
    medications: string[];
    remedies: string[];
  }[];
  notes: {
    time: Date;
    note: string;
  }[];
  riskFactors: Record<string, 'low' | 'med' | 'high'>;
};

export async function getJournalEntries({
  from,
  to,
}: {
  from: Date;
  to?: Date;
}): Promise<Record<string, JournalEntry> | undefined> {
  const journalEntries: Record<string, JournalEntry> = {};
  const auth = await getAuth();
  const formDefinition = await getFormDefinition({ auth });
  const formResponses = await getFormResponses({ auth, from });

  const questionMap: Record<string, string> = {};
  formDefinition.items?.forEach((item) => {
    if (item.questionItem) {
      const questionId = item.questionItem.question?.questionId;
      const title = item.title;
      if (questionId && title) {
        questionMap[questionId] = title;
      }
    }
  });

  formResponses.responses?.forEach((response) => {
    if (!response.answers) return;

    const symptomStart =
      response.answers['065980fd']?.textAnswers?.answers?.[0].value;
    const lastSubmittedTime = response.lastSubmittedTime;

    if (!symptomStart && !lastSubmittedTime) return;

    // Parse dates correctly based on presence of symptomStart or lastSubmittedTime
    const dateTime = symptomStart
      ? dayjs.tz(symptomStart, 'America/Los_Angeles')
      : dayjs(lastSubmittedTime).tz('America/Los_Angeles');

    const date = dateTime.format('YYYY-MM-DD');


    if (!journalEntries[date]) {
      journalEntries[date] = {
        date: dateTime.startOf('day').toDate(),
        painData: [],
        notes: [],
        riskFactors: {},
      };
    }

    const time = dateTime.toDate();
    const painLevel = response.answers['645e49c5']?.textAnswers?.answers?.[0]
      .value
      ? parseInt(
          response.answers['645e49c5']?.textAnswers?.answers?.[0]
            .value as string
        )
      : null;
    const remedies =
      response.answers['6b3c1ac6']?.textAnswers?.answers &&
      response.answers['6b3c1ac6']?.textAnswers?.answers?.length > 0
        ? (response.answers['6b3c1ac6']?.textAnswers?.answers
            .filter(
              (answer) => answer.value !== null && answer.value !== undefined
            )
            .map((answer) => answer.value) as string[]) ?? []
        : [];
    const medications =
      response.answers['7dafa2ba']?.textAnswers?.answers &&
      response.answers['7dafa2ba']?.textAnswers?.answers?.length > 0
        ? (response.answers['7dafa2ba']?.textAnswers?.answers
            .filter(
              (answer) => answer.value !== null && answer.value !== undefined
            )
            .map((answer) => answer.value) as string[]) ?? []
        : [];

    journalEntries[date].painData.push({
      time,
      level: painLevel,
      remedies,
      medications,
    });

    [
      '20018bcf',
      '1f14e108',
      '1f166a67',
      '57e852e0',
      '2094789c',
      '3c9831e5',
      '2cecca34',
    ].forEach((key) => {
      if (response.answers?.[key]) {
        const factorTitle = questionMap[key];
        journalEntries[date].riskFactors[factorTitle.toLowerCase()] = response
          .answers[key].textAnswers?.answers?.[0].value as
          | 'low'
          | 'med'
          | 'high';
      }
    });

    if (response.answers['2af75715']?.textAnswers?.answers?.[0].value) {
      journalEntries[date].notes.push({
        time,
        note: response.answers['2af75715']?.textAnswers?.answers?.[0].value,
      });
    }
  });

  // Sort journal entries by date
  const sortedJournalEntries = Object.fromEntries(
    Object.entries(journalEntries).sort(([a], [b]) => {
      return dayjs(a).isBefore(dayjs(b)) ? 1 : -1;
    })
  );

  // Sort the pain data by time
  Object.keys(sortedJournalEntries).forEach((date) => {
    sortedJournalEntries[date].painData.sort((a, b) => {
      return dayjs(a.time).isBefore(dayjs(b.time)) ? -1 : 1;
    });
  });

  // Sort notes by time
  Object.keys(sortedJournalEntries).forEach((date) => {
    sortedJournalEntries[date].notes.sort((a, b) => {
      return dayjs(a.time).isBefore(dayjs(b.time)) ? -1 : 1;
    });
  });

  // Filter out entries based on date range in PST
  if (to) {
    const start = dayjs.tz(from, 'America/Los_Angeles').startOf('day');
    const end = dayjs.tz(to, 'America/Los_Angeles').endOf('day');

    return Object.fromEntries(
      Object.entries(sortedJournalEntries).filter(([date]) => {
        const entryDate = dayjs.tz(date, 'America/Los_Angeles');
        return entryDate.isBetween(start, end, null, '[]');
      })
    );
  } else {
    const start = dayjs.tz(from, 'America/Los_Angeles').startOf('day');

    return Object.fromEntries(
      Object.entries(sortedJournalEntries).filter(([date]) => {
        const entryDate = dayjs.tz(date, 'America/Los_Angeles');
        return entryDate.isSame(start, 'day');
      })
    );
  }
}
