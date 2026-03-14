"use client";

import type { Event } from "@/features/events/queries";
import { getMonthGridDays, isSameDayUtil } from "../utils";
import { format, isSameMonth, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { brandTokens } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

const MAX_PREVIEW_MARKERS = 2;

const getEventColor = (colorId: string) => {
  return brandTokens.eventColors.find((c) => c.id === colorId) ?? brandTokens.eventColors[0];
};

type MonthGridProps = {
  currentDate: Date;
  events: Event[];
  selectedDate: Date;
  onDayClick: (date: Date) => void;
};

export function MonthGrid({ currentDate, events, selectedDate, onDayClick }: MonthGridProps) {
  const days = getMonthGridDays(currentDate);
  const today = new Date();

  const eventsByDay = days.map((day) =>
    events.filter((event) => isSameDayUtil(parseISO(event.start_time), day))
  );

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((label) => (
          <div key={label} className="p-2 text-center text-xs font-semibold text-muted-foreground">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = eventsByDay[index];
          const isToday = isSameDayUtil(day, today);
          const isSelected = isSameDayUtil(day, selectedDate);
          const inCurrentMonth = isSameMonth(day, currentDate);
          const hiddenCount = Math.max(0, dayEvents.length - MAX_PREVIEW_MARKERS);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onDayClick(day)}
              className={cn(
                "min-h-24 border-r border-b p-2 text-left align-top transition-colors last:border-r-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected && "bg-primary/10",
                !inCurrentMonth && "bg-muted/20 text-muted-foreground"
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-sm font-semibold",
                    isToday && "bg-primary text-primary-foreground"
                  )}
                >
                  {format(day, "d", { locale: de })}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-1">
                {dayEvents.slice(0, MAX_PREVIEW_MARKERS).map((event) => {
                  const color = getEventColor(event.color);
                  return (
                    <span
                      key={event.id}
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: color.border }}
                    />
                  );
                })}
                {hiddenCount > 0 && (
                  <span className="text-[10px] font-medium text-muted-foreground">+{hiddenCount}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
