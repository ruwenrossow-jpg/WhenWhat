import { createClient } from "@/lib/supabase/server";
import { buildExceptionMap, expandRecurringEvent, type RecurrenceException, type RecurrenceFrequency } from "./recurrence";

export type Event = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  color: string;
  is_recurring?: boolean;
  recurrence_type?: RecurrenceFrequency | null;
  recurrence_interval?: number | null;
  recurrence_days?: number[] | null;
  recurrence_until?: string | null;
  source_event_id?: string;
  is_recurring_instance?: boolean;
  occurrence_date?: string;
  created_at: string;
  updated_at: string;
};

type EventExceptionRecord = RecurrenceException;

function isSchemaMismatchError(error: { code?: string } | null): boolean {
  if (!error?.code) {
    return false;
  }

  // 42703: undefined_column, 42P01: undefined_table
  return error.code === "42703" || error.code === "42P01";
}

async function getLegacyEventsForRange(startDate: Date, endDate: Date): Promise<Event[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("start_time", startDate.toISOString())
    .lte("start_time", endDate.toISOString())
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching legacy events:", error);
    return [];
  }

  return (data || []) as Event[];
}

async function getEventsForRange(startDate: Date, endDate: Date): Promise<Event[]> {
  const supabase = await createClient();

  const [oneOffResult, recurringResult] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("is_recurring", false)
      .gte("start_time", startDate.toISOString())
      .lte("start_time", endDate.toISOString())
      .order("start_time", { ascending: true }),
    supabase
      .from("events")
      .select("*")
      .eq("is_recurring", true)
      .lte("start_time", endDate.toISOString())
      .or(`recurrence_until.is.null,recurrence_until.gte.${startDate.toISOString().slice(0, 10)}`)
      .order("start_time", { ascending: true }),
  ]);

  if (oneOffResult.error) {
    if (isSchemaMismatchError(oneOffResult.error)) {
      console.warn("Recurrence migration missing, using legacy event query path.");
      return getLegacyEventsForRange(startDate, endDate);
    }

    console.error("Error fetching one-off events:", oneOffResult.error);
    return [];
  }

  if (recurringResult.error) {
    if (isSchemaMismatchError(recurringResult.error)) {
      console.warn("Recurrence migration incomplete, returning one-off events only.");
      return (oneOffResult.data || []) as Event[];
    }

    console.error("Error fetching recurring events:", recurringResult.error);
    return oneOffResult.data || [];
  }

  const recurringEvents = (recurringResult.data || []) as Event[];
  if (recurringEvents.length === 0) {
    return (oneOffResult.data || []) as Event[];
  }

  const recurringIds = recurringEvents.map((event) => event.id);
  const { data: exceptionsData, error: exceptionsError } = await supabase
    .from("event_recurrence_exceptions")
    .select("event_id,occurrence_date,is_deleted,title,description,start_time,end_time,color")
    .in("event_id", recurringIds)
    .gte("occurrence_date", startDate.toISOString().slice(0, 10))
    .lte("occurrence_date", endDate.toISOString().slice(0, 10));

  if (exceptionsError) {
    if (isSchemaMismatchError(exceptionsError)) {
      console.warn("Recurrence exceptions table missing, returning generated recurring events without overrides.");
      const expandedWithoutExceptions = recurringEvents.flatMap((event) =>
        expandRecurringEvent(event, startDate, endDate, new Map())
      );

      return [
        ...((oneOffResult.data || []) as Event[]),
        ...expandedWithoutExceptions,
      ].sort((a, b) => a.start_time.localeCompare(b.start_time));
    }

    console.error("Error fetching recurrence exceptions:", exceptionsError);
  }

  const exceptionMap = buildExceptionMap((exceptionsData || []) as EventExceptionRecord[]);
  const expanded = recurringEvents.flatMap((event) =>
    expandRecurringEvent(event, startDate, endDate, exceptionMap)
  );

  return [
    ...((oneOffResult.data || []) as Event[]),
    ...expanded,
  ].sort((a, b) => a.start_time.localeCompare(b.start_time));
}

/**
 * Holt alle Events für einen bestimmten Tag
 */
export async function getEventsForDay(date: Date): Promise<Event[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return getEventsForRange(startOfDay, endOfDay);
}

/**
 * Holt alle Events für eine Woche
 */
export async function getEventsForWeek(startDate: Date): Promise<Event[]> {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return getEventsForRange(startDate, endDate);
}

/**
 * Holt alle Events für einen Monat
 */
export async function getEventsForMonth(date: Date): Promise<Event[]> {
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

  return getEventsForRange(startDate, endDate);
}

/**
 * Holt ein einzelnes Event per ID
 */
export async function getEventById(eventId: string): Promise<Event | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error) {
    console.error("Error fetching event:", error);
    return null;
  }

  return data;
}
