import { promises as fs } from 'fs';
import { FormDefinitionSchema } from './schemas/form-definition';
import { FormResponsesSchema } from './schemas/form-responses';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getFormDefinition } from './form-definition';
import { getFormResponses } from './form-responses';
import { getAuth } from './auth';
dayjs.extend(utc);

export type JournalEntry = {
  date: Date;
  painData: { time: Date; level: number; medications: string[]; remedies: string[] }[];
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
  const formDefinition = await getFormDefinition({
    auth,
  });
  const formResponses = await getFormResponses({
    auth,
    from,
  });

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
    const symptomStart = response.answers['065980fd']?.textAnswers?.answers?.[0].value;
    const lastSubmittedTime = response.lastSubmittedTime;
    if (!symptomStart && !lastSubmittedTime) return;
    const dateTime = symptomStart
      ? dayjs(symptomStart).format()
      : dayjs(lastSubmittedTime).format();
    const date = dayjs(dateTime).format('YYYY-MM-DD');
    if (!journalEntries[date]) {
      journalEntries[date] = {
        date: new Date(date),
        painData: [],
        notes: [],
        riskFactors: {},
      };
    }

    const time = dayjs(dateTime).toDate();
    const painLevel = response.answers['645e49c5']?.textAnswers?.answers?.[0].value
      ? parseInt(response.answers['645e49c5']?.textAnswers?.answers?.[0].value as string)
      : 0;
    const remedies =
      response.answers['6b3c1ac6']?.textAnswers?.answers &&
      response.answers['6b3c1ac6']?.textAnswers?.answers?.length > 0
        ? (response.answers['6b3c1ac6']?.textAnswers?.answers
            .filter((answer) => answer.value !== null && answer.value !== undefined)
            .map((answer) => answer.value) as string[]) ?? []
        : [];
    const medications =
      response.answers['7dafa2ba']?.textAnswers?.answers &&
      response.answers['7dafa2ba']?.textAnswers?.answers?.length > 0
        ? (response.answers['7dafa2ba']?.textAnswers?.answers
            .filter((answer) => answer.value !== null && answer.value !== undefined)
            .map((answer) => answer.value) as string[]) ?? []
        : [];

    // const medications = response.answers['7dafa2ba']?.textAnswers?.answers?.[0].value
    //   ? [response.answers['7dafa2ba']?.textAnswers.answers[0].value]
    //   : [];

    journalEntries[date].painData.push({ time, level: painLevel, remedies, medications });

    // Update factors with the latest response
    ['20018bcf', '1f14e108', '1f166a67', '57e852e0', '2094789c', '3c9831e5', '2cecca34'].forEach(
      (key) => {
        if (response.answers?.[key]) {
          const factorTitle = questionMap[key];
          journalEntries[date].riskFactors[factorTitle.toLowerCase()] = response.answers[key]
            .textAnswers?.answers?.[0].value as 'low' | 'med' | 'high';
        }
      }
    );
    if(response.answers['2af75715']?.textAnswers?.answers?.[0].value) {
      journalEntries[date].notes.push({ time, note: response.answers['2af75715']?.textAnswers?.answers?.[0].value });
    }
  });

  // sord journal entries by date
  const sortedJournalEntries = Object.fromEntries(
    Object.entries(journalEntries).sort(([a], [b]) => {
      return dayjs(a).isBefore(dayjs(b)) ? 1 : -1;
    })
  );
  // sort the pain data by time
  Object.keys(sortedJournalEntries).forEach((date) => {
    sortedJournalEntries[date].painData.sort((a, b) => {
      return dayjs(a.time).isBefore(dayjs(b.time)) ? -1 : 1;
    });
  });
  // sort notes by time
  Object.keys(sortedJournalEntries).forEach((date) => {
    sortedJournalEntries[date].notes.sort((a, b) => {
      return dayjs(a.time).isBefore(dayjs(b.time)) ? -1 : 1;
    });
  });

  // filter out entries - if a start date only, return only entries from that date, if a start date and end date, return entries between those dates
  if (to) {
    // convert dates to number for comparison
    const start = dayjs(from).format('YYYY-MM-DD');
    const end = dayjs(to).format('YYYY-MM-DD');

    return Object.fromEntries(
      Object.entries(sortedJournalEntries).filter(([date]) => {
        return dayjs(date).format('YYYY-MM-DD') >= start && dayjs(date).format('YYYY-MM-DD') <= end;
      })
    );
  } else {
    const start = dayjs(from).format('YYYY-MM-DD');
    return Object.fromEntries(
      Object.entries(sortedJournalEntries).filter(([date]) => {
        return dayjs(date).format('YYYY-MM-DD') === start;
      })
    );
  }
}
