"use client";

import { CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, isSameDay } from "date-fns";
import { de } from "date-fns/locale";
import { EventDialog } from "@/features/events/components/event-dialog";
import { FloatingActionButton } from "@/features/events/components/floating-action-button";
import { DateNavigation } from "@/features/calendar/components/date-navigation";
import { WeekTimelineGrid } from "@/features/calendar/components/week-timeline-grid";
import { TimelineZoomControls } from "@/features/calendar/components/timeline-zoom-controls";
import { WeekTimelineSkeleton } from "@/features/calendar/components/loading-skeletons";
import type { Event } from "@/features/events/queries";
import { useTimelineViewport } from "@/lib/design/hooks";
import {
  fetchEventsFromApi,
  getCachedEvents,
  invalidateCachedEvents,
  prefetchEvents,
} from "@/features/events/client-cache";
import {
  getToday,
  getPreviousWeek,
  getNextWeek,
  getWeekDays,
  formatDateForURL,
  parseDateFromURL,
} from "@/features/calendar/utils";

export default function WeekViewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get date from URL or use today
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const dateParam = searchParams.get("date");
    return dateParam ? parseDateFromURL(dateParam) : getToday();
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState<{ start_time?: string; end_time?: string } | undefined>();
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const timelineViewport = useTimelineViewport("week");
  const weekDays = getWeekDays(currentDate);
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const isCurrentWeek = weekDays.some((day) => isSameDay(day, new Date()));

  // Refresh events list
  const refreshEvents = () => {
    invalidateCachedEvents("week", formatDateForURL(currentDate));
    setRefreshKey((prev) => prev + 1);
  };

  // Update URL when date changes
  useEffect(() => {
    const dateStr = formatDateForURL(currentDate);
    router.push(`/week?date=${dateStr}`, { scroll: false });
  }, [currentDate, router]);

  // Fetch events for current week
  useEffect(() => {
    const abortController = new AbortController();
    const dateString = formatDateForURL(currentDate);
    const cachedEvents = getCachedEvents("week", dateString);
    
    const fetchEvents = async () => {
      if (cachedEvents) {
        setEvents(cachedEvents);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const result = await fetchEventsFromApi("week", dateString, {
          signal: abortController.signal,
        });

        if (result.kind === "auth") {
          console.error("Authentication failed, redirecting to login");
          router.push("/login");
          return;
        }

        if (result.kind === "success") {
          setEvents(result.events);

          const previousWeek = formatDateForURL(getPreviousWeek(currentDate));
          const nextWeek = formatDateForURL(getNextWeek(currentDate));
          setTimeout(() => {
            void prefetchEvents("week", previousWeek);
            void prefetchEvents("week", nextWeek);
          }, 0);
          return;
        }

        if (!cachedEvents) {
          setError("Events konnten nicht geladen werden");
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error fetching events:", error);

          if (!cachedEvents) {
            setError("Fehler beim Laden der Events. Bitte erneut versuchen.");
          }
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchEvents();
    
    return () => abortController.abort();
  }, [currentDate, refreshKey, router]);

  const handlePrevious = () => setCurrentDate(getPreviousWeek(currentDate));
  const handleNext = () => setCurrentDate(getNextWeek(currentDate));
  const handleSlotSelect = (slot: { start_time: string; end_time: string }) => {
    setCreateDraft(slot);
    setIsCreateDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-4 calendar-view-transition">
        <h2 className="font-accent text-3xl text-center text-foreground mb-4 animate-in fade-in duration-500">
          Diese Woche
        </h2>
        
        <DateNavigation
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onPrevious={handlePrevious}
          onNext={handleNext}
          mode="week"
        />

        <div className="sticky top-2 z-30 rounded-2xl border border-border/80 bg-background/85 backdrop-blur-md p-3 shadow-sm space-y-3 week-context-enter">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Wochenfokus</p>
              <p className="text-sm font-semibold text-foreground">
                {format(weekStart, "d. MMM", { locale: de })} - {format(weekEnd, "d. MMM yyyy", { locale: de })}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentDate(getToday())}
              className="calendar-interactive rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
            >
              Heute
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {weekDays.map((day, dayIndex) => {
              const isTodayChip = isSameDay(day, new Date());
              return (
                <div
                  key={day.toISOString()}
                  className={`rounded-lg px-1.5 py-1 text-center border transition-colors week-chip-enter ${
                    isTodayChip
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background/80 text-foreground border-border"
                  }`}
                  style={{ animationDelay: `${30 + dayIndex * 35}ms` }}
                >
                  <p className="text-[10px] uppercase tracking-wide opacity-80">
                    {format(day, "EE", { locale: de })}
                  </p>
                  <p className="text-sm font-semibold leading-none mt-1">{format(day, "d")}</p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {isCurrentWeek ? "Aktuelle Woche" : "Nicht aktuelle Woche"}
            </span>
            <TimelineZoomControls
              label={timelineViewport.zoomPreset}
              onZoomOut={timelineViewport.zoomOut}
              onZoomIn={timelineViewport.zoomIn}
              canZoomOut={timelineViewport.canZoomOut}
              canZoomIn={timelineViewport.canZoomIn}
            />
          </div>
        </div>

        {isLoading ? (
          <WeekTimelineSkeleton />
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="text-destructive">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-destructive">Fehler beim Laden</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={refreshEvents}
              className="w-full sm:w-auto px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors text-sm font-medium"
            >
              Erneut versuchen
            </button>
          </div>
        ) : (
          <>
            <WeekTimelineGrid
              currentDate={currentDate}
              events={events}
              onEventClick={setEditingEvent}
              onSlotSelect={handleSlotSelect}
              hourHeight={timelineViewport.hourHeight}
            />
            {events.length === 0 && (
              <div className="mt-4 text-center p-6 bg-muted/30 rounded-lg border border-dashed">
                <CalendarDays className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground font-medium">
                  Keine Events diese Woche
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Erstelle ein Event mit dem + Button
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <FloatingActionButton
        onClick={() => {
          setCreateDraft(undefined);
          setIsCreateDialogOpen(true);
        }}
      />

      <EventDialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) {
            setCreateDraft(undefined);
          }
        }}
        onSuccess={refreshEvents}
        mode="create"
        initialValues={createDraft}
      />

      <EventDialog
        open={!!editingEvent}
        onOpenChange={(open) => {
          if (!open) setEditingEvent(undefined);
        }}
        onSuccess={refreshEvents}
        mode="edit"
        event={editingEvent}
      />
    </>
  );
}
