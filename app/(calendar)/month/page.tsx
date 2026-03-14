"use client";

import { CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EventDialog } from "@/features/events/components/event-dialog";
import { FloatingActionButton } from "@/features/events/components/floating-action-button";
import { DateNavigation } from "@/features/calendar/components/date-navigation";
import { MonthGrid } from "@/features/calendar/components/month-grid";
import { DayDetailSheet } from "@/features/calendar/components/day-detail-sheet";
import { MonthGridSkeleton } from "@/features/calendar/components/loading-skeletons";
import type { Event } from "@/features/events/queries";
import {
  fetchEventsFromApi,
  getCachedEvents,
  invalidateCachedEvents,
  prefetchEvents,
} from "@/features/events/client-cache";
import {
  getToday,
  getPreviousMonth,
  getNextMonth,
  formatDateForURL,
  parseDateFromURL,
} from "@/features/calendar/utils";

export default function MonthViewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const dateParam = searchParams.get("date");
    return dateParam ? parseDateFromURL(dateParam) : getToday();
  });

  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState<{ start_time?: string; end_time?: string } | undefined>();
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshEvents = () => {
    invalidateCachedEvents("month", formatDateForURL(currentDate));
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const dateStr = formatDateForURL(currentDate);
    router.push(`/month?date=${dateStr}`, { scroll: false });
  }, [currentDate, router]);

  useEffect(() => {
    const abortController = new AbortController();
    const dateString = formatDateForURL(currentDate);
    const cachedEvents = getCachedEvents("month", dateString);

    const fetchEvents = async () => {
      if (cachedEvents) {
        setEvents(cachedEvents);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const result = await fetchEventsFromApi("month", dateString, {
          signal: abortController.signal,
        });

        if (result.kind === "auth") {
          router.push("/login");
          return;
        }

        if (result.kind === "success") {
          setEvents(result.events);

          const previousMonth = formatDateForURL(getPreviousMonth(currentDate));
          const nextMonth = formatDateForURL(getNextMonth(currentDate));
          setTimeout(() => {
            void prefetchEvents("month", previousMonth);
            void prefetchEvents("month", nextMonth);
          }, 0);
          return;
        }

        if (!cachedEvents) {
          setError("Events konnten nicht geladen werden");
        }
      } catch (fetchError: unknown) {
        if (fetchError instanceof Error && fetchError.name !== "AbortError") {
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

  const handlePrevious = () => setCurrentDate(getPreviousMonth(currentDate));
  const handleNext = () => setCurrentDate(getNextMonth(currentDate));

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsDetailSheetOpen(true);
  };

  const toLocalDateTimeValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const openCreateFromSelectedDay = () => {
    const start = new Date(selectedDate);
    start.setHours(9, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(10, 0, 0, 0);

    setCreateDraft({
      start_time: toLocalDateTimeValue(start),
      end_time: toLocalDateTimeValue(end),
    });
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
          mode="month"
        />

        {isLoading ? (
          <MonthGridSkeleton />
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-sm text-destructive">
            {error}
          </div>
        ) : (
          <>
            <MonthGrid
              currentDate={currentDate}
              events={events}
              selectedDate={selectedDate}
              onDayClick={handleDayClick}
            />
            {events.length === 0 && (
              <div className="mt-2 text-center p-6 bg-muted/30 rounded-lg border border-dashed">
                <CalendarDays className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground font-medium">Keine Events in diesem Monat</p>
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

      <button
        type="button"
        onClick={openCreateFromSelectedDay}
        className="fixed bottom-28 right-6 z-30 rounded-full border border-border bg-background/90 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-md calendar-interactive"
      >
        Event am {formatDateForURL(selectedDate)}
      </button>

      <DayDetailSheet
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        selectedDate={selectedDate}
        events={events}
        onEventClick={setEditingEvent}
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