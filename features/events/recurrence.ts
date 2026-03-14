import type { Event } from "./queries";

export type RecurrenceFrequency = "daily" | "weekly" | "monthly";

export type RecurrenceException = {
  event_id: string;
  occurrence_date: string;
  is_deleted: boolean;
  title: string | null;
  description: string | null;
  start_time: string | null;
  end_time: string | null;
  color: string | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const toDateOnly = (date: Date): string => date.toISOString().slice(0, 10);

const startOfDayUTC = (date: Date): Date => {
  const next = new Date(date);
  next.setUTCHours(0, 0, 0, 0);
  return next;
};

const endOfDayUTC = (date: Date): Date => {
  const next = new Date(date);
  next.setUTCHours(23, 59, 59, 999);
  return next;
};

const normalizeWeekday = (date: Date): number => {
  // Convert JS weekday (0..6, Sun..Sat) to Monday-first format (1..7)
  const jsDay = date.getUTCDay();
  return jsDay === 0 ? 7 : jsDay;
};

const addMonthsUTC = (date: Date, count: number): Date => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const targetMonth = month + count;
  const firstOfTarget = new Date(Date.UTC(year, targetMonth, 1));
  const lastOfTarget = new Date(Date.UTC(firstOfTarget.getUTCFullYear(), firstOfTarget.getUTCMonth() + 1, 0));
  const targetDay = Math.min(day, lastOfTarget.getUTCDate());

  return new Date(
    Date.UTC(
      firstOfTarget.getUTCFullYear(),
      firstOfTarget.getUTCMonth(),
      targetDay,
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    )
  );
};

const withShift = (base: Date, dayShift: number, durationMs: number): { start: Date; end: Date } => {
  const start = new Date(base.getTime() + dayShift * DAY_MS);
  const end = new Date(start.getTime() + durationMs);
  return { start, end };
};

const exceptionKey = (eventId: string, occurrenceDate: string) => `${eventId}::${occurrenceDate}`;

export function expandRecurringEvent(
  event: Event,
  rangeStart: Date,
  rangeEnd: Date,
  exceptionsMap: Map<string, RecurrenceException>
): Event[] {
  if (!event.is_recurring || !event.recurrence_type) {
    return [];
  }

  const start = new Date(event.start_time);
  const end = new Date(event.end_time);
  const durationMs = end.getTime() - start.getTime();
  if (durationMs <= 0) {
    return [];
  }

  const frequency = event.recurrence_type;
  const interval = Math.max(1, event.recurrence_interval ?? 1);
  const until = event.recurrence_until ? endOfDayUTC(new Date(`${event.recurrence_until}T00:00:00.000Z`)) : null;

  const maxRangeEnd = until && until < rangeEnd ? until : rangeEnd;
  if (start > maxRangeEnd) {
    return [];
  }

  const output: Event[] = [];
  const windowStart = startOfDayUTC(rangeStart);
  const baseDay = startOfDayUTC(start);

  if (frequency === "daily") {
    let cursor = new Date(start);
    if (cursor < windowStart) {
      const diffDays = Math.floor((windowStart.getTime() - baseDay.getTime()) / DAY_MS);
      const jump = Math.floor(diffDays / interval) * interval;
      cursor = new Date(start.getTime() + jump * DAY_MS);
      while (cursor < windowStart) {
        cursor = new Date(cursor.getTime() + interval * DAY_MS);
      }
    }

    while (cursor <= maxRangeEnd) {
      const occurrenceDate = toDateOnly(cursor);
      const ex = exceptionsMap.get(exceptionKey(event.id, occurrenceDate));
      if (!ex?.is_deleted) {
        const generatedStart = ex?.start_time ? new Date(ex.start_time) : cursor;
        const generatedEnd = ex?.end_time ? new Date(ex.end_time) : new Date(generatedStart.getTime() + durationMs);
        output.push({
          ...event,
          id: `${event.id}__${occurrenceDate}`,
          source_event_id: event.id,
          is_recurring_instance: true,
          occurrence_date: occurrenceDate,
          title: ex?.title ?? event.title,
          description: ex?.description ?? event.description,
          color: ex?.color ?? event.color,
          start_time: generatedStart.toISOString(),
          end_time: generatedEnd.toISOString(),
        });
      }

      cursor = new Date(cursor.getTime() + interval * DAY_MS);
    }

    return output;
  }

  if (frequency === "weekly") {
    const weekdays = (event.recurrence_days && event.recurrence_days.length > 0
      ? event.recurrence_days
      : [normalizeWeekday(start)]
    ).slice().sort((a, b) => a - b);

    const baseWeekday = normalizeWeekday(start);
    const windowEndDay = startOfDayUTC(maxRangeEnd);

    for (let dayCursor = new Date(windowStart); dayCursor <= windowEndDay; dayCursor = new Date(dayCursor.getTime() + DAY_MS)) {
      const daysSinceBase = Math.floor((dayCursor.getTime() - baseDay.getTime()) / DAY_MS);
      if (daysSinceBase < 0) {
        continue;
      }

      const weekOffset = Math.floor(daysSinceBase / 7);
      if (weekOffset % interval !== 0) {
        continue;
      }

      const weekday = normalizeWeekday(dayCursor);
      if (!weekdays.includes(weekday)) {
        continue;
      }

      const occStart = new Date(
        Date.UTC(
          dayCursor.getUTCFullYear(),
          dayCursor.getUTCMonth(),
          dayCursor.getUTCDate(),
          start.getUTCHours(),
          start.getUTCMinutes(),
          start.getUTCSeconds(),
          start.getUTCMilliseconds()
        )
      );
      const occEnd = new Date(occStart.getTime() + durationMs);

      if (occStart < start || occStart > maxRangeEnd) {
        continue;
      }

      const occurrenceDate = toDateOnly(occStart);
      const ex = exceptionsMap.get(exceptionKey(event.id, occurrenceDate));
      if (ex?.is_deleted) {
        continue;
      }

      const generatedStart = ex?.start_time ? new Date(ex.start_time) : occStart;
      const generatedEnd = ex?.end_time ? new Date(ex.end_time) : occEnd;
      output.push({
        ...event,
        id: `${event.id}__${occurrenceDate}`,
        source_event_id: event.id,
        is_recurring_instance: true,
        occurrence_date: occurrenceDate,
        title: ex?.title ?? event.title,
        description: ex?.description ?? event.description,
        color: ex?.color ?? event.color,
        start_time: generatedStart.toISOString(),
        end_time: generatedEnd.toISOString(),
      });
    }

    return output;
  }

  // monthly
  let cursor = new Date(start);
  while (cursor < windowStart) {
    cursor = addMonthsUTC(cursor, interval);
  }

  while (cursor <= maxRangeEnd) {
    const occurrenceDate = toDateOnly(cursor);
    const ex = exceptionsMap.get(exceptionKey(event.id, occurrenceDate));
    if (!ex?.is_deleted) {
      const generatedStart = ex?.start_time ? new Date(ex.start_time) : cursor;
      const generatedEnd = ex?.end_time ? new Date(ex.end_time) : new Date(generatedStart.getTime() + durationMs);
      output.push({
        ...event,
        id: `${event.id}__${occurrenceDate}`,
        source_event_id: event.id,
        is_recurring_instance: true,
        occurrence_date: occurrenceDate,
        title: ex?.title ?? event.title,
        description: ex?.description ?? event.description,
        color: ex?.color ?? event.color,
        start_time: generatedStart.toISOString(),
        end_time: generatedEnd.toISOString(),
      });
    }

    cursor = addMonthsUTC(cursor, interval);
  }

  return output;
}

export function buildExceptionMap(exceptions: RecurrenceException[]): Map<string, RecurrenceException> {
  return new Map(exceptions.map((ex) => [exceptionKey(ex.event_id, ex.occurrence_date), ex]));
}