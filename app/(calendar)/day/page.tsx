"use client";

import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EventDialog } from "@/features/events/components/event-dialog";
import { FloatingActionButton } from "@/features/events/components/floating-action-button";
import { DateNavigation } from "@/features/calendar/components/date-navigation";
import { DayTimeline } from "@/features/calendar/components/day-timeline";
import { TimelineZoomControls } from "@/features/calendar/components/timeline-zoom-controls";
import { DayTimelineSkeleton } from "@/features/calendar/components/loading-skeletons";
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
  getPreviousDay,
  getNextDay,
  formatDateForURL,
  parseDateFromURL,
} from "@/features/calendar/utils";

export default function DayViewPage() {
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
  const timelineViewport = useTimelineViewport("day");

  // Refresh events list
  const refreshEvents = () => {
    invalidateCachedEvents("day", formatDateForURL(currentDate));
    setRefreshKey((prev) => prev + 1);
  };

  // Update URL when date changes
  useEffect(() => {
    const dateStr = formatDateForURL(currentDate);
    router.push(`/day?date=${dateStr}`, { scroll: false });
  }, [currentDate, router]);

  // Fetch events for current day
  useEffect(() => {
    const abortController = new AbortController();
    const dateString = formatDateForURL(currentDate);
    const cachedEvents = getCachedEvents("day", dateString);
    
    const fetchEvents = async () => {
      if (cachedEvents) {
        setEvents(cachedEvents);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const result = await fetchEventsFromApi("day", dateString, {
          signal: abortController.signal,
        });

        if (result.kind === "auth") {
          console.error("Authentication failed, redirecting to login");
          router.push("/login");
          return;
        }

        if (result.kind === "success") {
          setEvents(result.events);

          const previousDay = formatDateForURL(getPreviousDay(currentDate));
          const nextDay = formatDateForURL(getNextDay(currentDate));
          setTimeout(() => {
            void prefetchEvents("day", previousDay);
            void prefetchEvents("day", nextDay);
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

  const handlePrevious = () => setCurrentDate(getPreviousDay(currentDate));
  const handleNext = () => setCurrentDate(getNextDay(currentDate));

  const handleSlotSelect = (slot: { start_time: string; end_time: string }) => {
    setCreateDraft(slot);
    setIsCreateDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-4 calendar-view-transition">
        <DateNavigation
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onPrevious={handlePrevious}
          onNext={handleNext}
          mode="day"
        />

        <TimelineZoomControls
          label={timelineViewport.zoomPreset}
          onZoomOut={timelineViewport.zoomOut}
          onZoomIn={timelineViewport.zoomIn}
          canZoomOut={timelineViewport.canZoomOut}
          canZoomIn={timelineViewport.canZoomIn}
        />

        {isLoading ? (
          <DayTimelineSkeleton />
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
            <DayTimeline
              currentDate={currentDate}
              events={events}
              onEventEdit={setEditingEvent}
              onSlotSelect={handleSlotSelect}
              hourHeight={timelineViewport.hourHeight}
              autoFocusOnNow={currentDate.toDateString() === new Date().toDateString()}
            />
            {events.length === 0 && (
              <div className="mt-4 text-center p-6 bg-muted/30 rounded-lg border border-dashed">
                <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground font-medium">
                  Keine Events für heute
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
