"use client";

import type { Event } from "@/features/events/queries";
import { getWeekDays, formatTime, isSameDayUtil, calculateEventPosition } from "../utils";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Clock } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useTimelineHeight } from "@/lib/design/hooks";
import { calendarConstants } from "@/lib/design/constants";
import { brandTokens } from "@/lib/design/tokens";

// Helper to get event color configuration
const getEventColor = (colorId: string) => {
  return brandTokens.eventColors.find(c => c.id === colorId) ?? brandTokens.eventColors[0];
};

type WeekTimelineGridProps = {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
};

export function WeekTimelineGrid({ currentDate, events, onEventClick }: WeekTimelineGridProps) {
  const weekDays = getWeekDays(currentDate);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const hourHeight = useTimelineHeight();
  const today = new Date();

  // Group events by day
  const eventsByDay = useMemo(() => {
    return weekDays.map((day) => {
      return events.filter((event) =>
        isSameDayUtil(parseISO(event.start_time), day)
      );
    });
  }, [weekDays, events]);

  return (
    <div className="bg-card rounded-lg border overflow-x-auto overflow-y-visible">
      <div className="flex" style={{ minWidth: calendarConstants.weekGrid.minWidth.timeline }}>
        {/* Time column - sticky */}
        <div className="sticky left-0 bg-card z-20 border-r flex-shrink-0" style={{ width: calendarConstants.timeline.timeColumnWidth }}>
          {/* Header spacer */}
          <div className="border-b-2 border-border" style={{ height: calendarConstants.weekGrid.headerHeight }} />
          
          {/* Hour labels */}
          <div className="relative" style={{ height: `${24 * hourHeight}px` }}>
            {hours.map((hour) => (
              <div
                key={hour}
                className="absolute left-0 right-0 border-t-2 border-border/50"
                style={{ top: `${hour * hourHeight}px` }}
              >
                <div className="absolute -top-3 left-3 text-sm font-medium text-muted-foreground bg-card px-2 py-0.5 rounded">
                  {hour.toString().padStart(2, "0")}:00
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Day columns */}
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((day, dayIndex) => {
            const isToday = isSameDayUtil(day, today);
            const dayEvents = eventsByDay[dayIndex];

            return (
              <div
                key={day.toISOString()}
                className={`border-r last:border-r-0 ${
                  isToday ? "bg-primary/5" : ""
                }`}
              >
                {/* Day header */}
                <div
                  className={`p-3 border-b-2 text-center transition-colors ${
                    isToday ? "border-b-primary bg-primary/10" : "border-b-border"
                  }`}
                  style={{ height: calendarConstants.weekGrid.headerHeight }}
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

                {/* Timeline grid for this day */}
                <div className="relative" style={{ height: `${24 * hourHeight}px` }}>
                  {/* Hour grid lines */}
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-t border-border/30"
                      style={{ top: `${hour * hourHeight}px` }}
                    />
                  ))}

                  {/* Events for this day */}
                  <div className="absolute inset-0 px-1">
                    {dayEvents.map((event) => {
                      const { top, height } = calculateEventPosition(
                        event.start_time,
                        event.end_time,
                        hourHeight
                      );
                      const eventColor = getEventColor(event.color);

                      return (
                        <div
                          key={event.id}
                          className="absolute left-1 right-1"
                          style={{ 
                            top: `${top}px`, 
                            height: `${Math.max(height, 30)}px`,
                          }}
                        >
                          <button
                            onClick={() => onEventClick(event)}
                            className="w-full h-full border-l-brand-thick rounded-md p-2 overflow-hidden hover:shadow-md transition-all text-left"
                            style={{ 
                              minHeight: calendarConstants.event.minHeight,
                              backgroundColor: eventColor.bg,
                              borderLeftColor: eventColor.border,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = eventColor.bgHover;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = eventColor.bg;
                            }}
                          >
                            <div className="font-semibold text-xs line-clamp-1">
                              {event.title}
                            </div>
                            {height > 40 && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Clock className="h-2.5 w-2.5" />
                                {formatTime(event.start_time)}
                              </div>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Current time indicator - only for today */}
                  {isToday && <CurrentTimeIndicatorWeek hourHeight={hourHeight} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CurrentTimeIndicatorWeek({ hourHeight }: { hourHeight: number }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const offset = (hours + minutes / 60) * hourHeight;

  return (
    <div
      className="absolute left-0 right-0 z-10 pointer-events-none"
      style={{ top: `${offset}px` }}
    >
      <div className="absolute -top-[1px] left-0 right-0 h-[2px] current-time-line" />
      <div className="absolute -top-2 -left-1 w-4 h-4 current-time-dot rounded-full border-2 border-background shadow-md" />
    </div>
  );
}
