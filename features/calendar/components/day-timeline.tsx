"use client";

import type { Event } from "@/features/events/queries";
import { calculateEventPosition, formatTime } from "../utils";
import { Clock } from "lucide-react";
import { useEffect, useRef, useState, useMemo, memo } from "react";
import type { MouseEvent } from "react";
import { useTimelineHeight } from "@/lib/design/hooks";
import { calendarConstants } from "@/lib/design/constants";
import { brandTokens } from "@/lib/design/tokens";

const toLocalDateTimeValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Helper to get event color configuration
const getEventColor = (colorId: string) => {
  return brandTokens.eventColors.find(c => c.id === colorId) ?? brandTokens.eventColors[0];
};

type DayTimelineProps = {
  currentDate: Date;
  events: Event[];
  onEventEdit: (event: Event) => void;
  onSlotSelect?: (slot: { start_time: string; end_time: string }) => void;
  hourHeight?: number;
  autoFocusOnNow?: boolean;
};

export function DayTimeline({
  currentDate,
  events,
  onEventEdit,
  onSlotSelect,
  hourHeight: controlledHourHeight,
  autoFocusOnNow = true,
}: DayTimelineProps) {
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const fallbackHourHeight = useTimelineHeight();
  const hourHeight = controlledHourHeight ?? fallbackHourHeight;
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoFocusOnNow || !rootRef.current) {
      return;
    }

    const now = new Date();
    const hoursFromStart = Math.max(
      0,
      now.getHours() + now.getMinutes() / 60 - calendarConstants.timeline.focusPaddingHours
    );
    const anchorTop = hoursFromStart * hourHeight;
    const scrollParent = rootRef.current.closest("main");

    if (!scrollParent) {
      return;
    }

    const rootTop = rootRef.current.getBoundingClientRect().top;
    const parentTop = scrollParent.getBoundingClientRect().top;
    const relativeTop = rootTop - parentTop + scrollParent.scrollTop;

    scrollParent.scrollTo({
      top: Math.max(0, relativeTop + anchorTop - 96),
      behavior: "smooth",
    });
  }, [autoFocusOnNow, hourHeight]);

  const handleTimelineClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!onSlotSelect) {
      return;
    }

    if ((event.target as HTMLElement).closest("[data-event-card='true']")) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetY = Math.max(0, event.clientY - bounds.top);
    const snappedMinutes = Math.min(
      23 * 60 + 30,
      Math.max(0, Math.round((offsetY / hourHeight) * 2) * 30)
    );
    const start = new Date(currentDate);
    start.setHours(0, 0, 0, 0);
    start.setMinutes(snappedMinutes);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 60);

    onSlotSelect({
      start_time: toLocalDateTimeValue(start),
      end_time: toLocalDateTimeValue(end),
    });
  };

  return (
    <div ref={rootRef} className="relative bg-card rounded-lg border overflow-visible calendar-view-transition">
      {/* Timeline Grid */}
      <div className="relative" style={{ height: `${24 * hourHeight}px` }} onClick={handleTimelineClick}>
        {/* Hour markers */}
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

        {/* Events overlay */}
        <div className="absolute inset-0 pl-20 pr-4">
          {events.map((event) => {
            const { top, height } = calculateEventPosition(
              event.start_time,
              event.end_time,
              hourHeight
            );
            const eventColor = getEventColor(event.color);

            return (
              <div
                key={event.id}
                className="absolute left-20 right-4"
                data-event-card="true"
                style={{ top: `${top}px`, height: `${height}px`, minHeight: calendarConstants.event.minHeight }}
              >
                <div 
                  className="h-full border-l-brand-event rounded-md p-3 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => onEventEdit(event)}
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
                  <div className="font-semibold text-sm line-clamp-1 mb-1">
                    {event.title}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                  </div>
                  {event.description && height > 60 && (
                    <div className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {event.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current time indicator */}
      <MemoizedCurrentTimeIndicator hourHeight={hourHeight} />
    </div>
  );
}

function CurrentTimeIndicator({ hourHeight }: { hourHeight: number }) {
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
      <div className="absolute -top-2.5 left-3 flex items-center gap-2">
        <div className="w-5 h-5 current-time-dot rounded-full border-2 border-background shadow-md" />
        <span className="text-xs font-semibold current-time-text bg-background px-2 py-0.5 rounded shadow-sm">
          Jetzt
        </span>
      </div>
    </div>
  );
}

// Memoize to prevent parent re-renders from affecting this component
const MemoizedCurrentTimeIndicator = memo(CurrentTimeIndicator);
