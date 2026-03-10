"use client";

import type { Event } from "@/features/events/queries";
import { getWeekDays, formatTime, isSameDayUtil } from "../utils";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

type WeekGridProps = {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
};

export function WeekGrid({ currentDate, events, onEventClick }: WeekGridProps) {
  const weekDays = getWeekDays(currentDate);
  const MAX_VISIBLE_EVENTS = 3;

  // Group events by day
  const eventsByDay = weekDays.map((day) => {
    return events.filter((event) =>
      isSameDayUtil(parseISO(event.start_time), day)
    );
  });

  return (
    <div className="bg-card rounded-lg border overflow-x-auto">
      <div className="grid grid-cols-7 min-w-[700px]">
        {/* Header */}
        {weekDays.map((day) => {
          const isToday = isSameDayUtil(day, new Date());
          return (
            <div
              key={day.toISOString()}
              className={`p-3 border-r last:border-r-0 border-b-2 text-center transition-colors ${
                isToday ? "bg-primary/10 border-b-primary" : "border-b-border"
              }`}
            >
              <div className="text-xs text-muted-foreground uppercase font-medium">
                {format(day, "EEE", { locale: de })}
              </div>
              <div
                className={`text-xl font-bold mt-1 ${
                  isToday ? "text-primary" : ""
                }`}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}

        {/* Events */}
        {weekDays.map((day, dayIndex) => {
          const dayEvents = eventsByDay[dayIndex];
          const isToday = isSameDayUtil(day, new Date());
          const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
          const hiddenCount = dayEvents.length - MAX_VISIBLE_EVENTS;

          return (
            <div
              key={day.toISOString()}
              className={`p-2 border-r last:border-r-0 min-h-[250px] transition-colors ${
                isToday ? "bg-primary/5" : ""
              }`}
            >
              <div className="space-y-2">
                {dayEvents.length === 0 ? (
                  <div className="text-xs text-muted-foreground text-center py-8 opacity-50">
                    Keine Events
                  </div>
                ) : (
                  <>
                    {visibleEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className="w-full text-left bg-primary/10 hover:bg-primary/15 border-l-[4px] border-primary rounded-md p-2 hover:shadow-md transition-all"
                      >
                        <div className="font-semibold text-sm line-clamp-1 mb-1">
                          {event.title}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {formatTime(event.start_time)}
                        </div>
                      </button>
                    ))}
                    {hiddenCount > 0 && (
                      <div className="text-xs text-center py-2 text-primary font-medium">
                        +{hiddenCount} weitere{hiddenCount > 1 ? "" : "s"}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
