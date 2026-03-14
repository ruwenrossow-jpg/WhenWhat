import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  format,
  startOfDay,
  endOfDay,
  isSameDay,
  parseISO,
} from "date-fns";
import { de } from "date-fns/locale";

/**
 * Get start of week (Monday)
 */
export function getStartOfWeek(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1, locale: de });
}

/**
 * Get end of week (Sunday)
 */
export function getEndOfWeek(date: Date): Date {
  return endOfWeek(date, { weekStartsOn: 1, locale: de });
}

/**
 * Format date for display
 */
export function formatDateHeader(date: Date, mode: "day" | "week" | "month"): string {
  if (mode === "day") {
    return format(date, "EEEE, d. MMMM yyyy", { locale: de });
  }

  if (mode === "week") {
    const start = getStartOfWeek(date);
    const end = getEndOfWeek(date);
    return `${format(start, "d. MMM", { locale: de })} - ${format(
      end,
      "d. MMM",
      { locale: de }
    )}`;
  }

  return format(date, "MMMM yyyy", { locale: de });
}

/**
 * Format time for display (HH:mm)
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "HH:mm");
}

/**
 * Get array of dates for a week
 */
export function getWeekDays(date: Date): Date[] {
  const start = getStartOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * Calculate Y position for timeline based on time
 * @param time ISO string or Date
 * @param hourHeight height in pixels for one hour
 */
export function calculateEventPosition(
  startTime: string | Date,
  endTime: string | Date,
  hourHeight: number = 60
): { top: number; height: number } {
  const start = typeof startTime === "string" ? parseISO(startTime) : startTime;
  const end = typeof endTime === "string" ? parseISO(endTime) : endTime;

  const startHour = start.getHours();
  const startMinute = start.getMinutes();
  const endHour = end.getHours();
  const endMinute = end.getMinutes();

  const startOffset = startHour + startMinute / 60;
  const endOffset = endHour + endMinute / 60;

  const top = startOffset * hourHeight;
  const height = (endOffset - startOffset) * hourHeight;

  return { top, height: Math.max(height, 30) }; // min height 30px
}

/**
 * Navigate to previous day
 */
export function getPreviousDay(date: Date): Date {
  return subDays(date, 1);
}

/**
 * Navigate to next day
 */
export function getNextDay(date: Date): Date {
  return addDays(date, 1);
}

/**
 * Navigate to previous week
 */
export function getPreviousWeek(date: Date): Date {
  return subWeeks(date, 1);
}

/**
 * Navigate to next week
 */
export function getNextWeek(date: Date): Date {
  return addWeeks(date, 1);
}

/**
 * Navigate to previous month
 */
export function getPreviousMonth(date: Date): Date {
  return subMonths(date, 1);
}

/**
 * Navigate to next month
 */
export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

/**
 * Get all days needed to render a complete month grid (Monday-first, 6 rows)
 */
export function getMonthGridDays(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const gridStart = getStartOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1, locale: de });

  const days: Date[] = [];
  let current = gridStart;

  while (current <= gridEnd) {
    days.push(current);
    current = addDays(current, 1);
  }

  return days;
}

/**
 * Get today at start of day
 */
export function getToday(): Date {
  return startOfDay(new Date());
}

/**
 * Check if two dates are the same day
 */
export function isSameDayUtil(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}

/**
 * Format date for URL params (YYYY-MM-DD)
 */
export function formatDateForURL(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Parse date from URL params
 */
export function parseDateFromURL(dateString: string): Date {
  try {
    return parseISO(dateString);
  } catch {
    return new Date();
  }
}
