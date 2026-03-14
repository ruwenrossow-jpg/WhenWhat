"use client";

import { CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EventDialog } from "@/features/events/components/event-dialog";
import { FloatingActionButton } from "@/features/events/components/floating-action-button";
import { DateNavigation } from "@/features/calendar/components/date-navigation";
import { MonthGrid } from "@/features/calendar/components/month-grid";
import { DayDetailSheet } from "@/features/calendar/components/day-detail-sheet";
import type { Event } from "@/features/events/queries";
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
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshEvents = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    const dateStr = formatDateForURL(currentDate);
    router.push(`/month?date=${dateStr}`, { scroll: false });
  }, [currentDate, router]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/events/month?date=${formatDateForURL(currentDate)}`,
          { signal: abortController.signal }
        );

        if (response.status === 401 || response.status === 403) {
          router.push("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          setError("Events konnten nicht geladen werden");
        }
      } catch (fetchError: unknown) {
        if (fetchError instanceof Error && fetchError.name !== "AbortError") {
          setError("Fehler beim Laden der Events. Bitte erneut versuchen.");
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

  return (
    <>
      <div className="space-y-4">
        <DateNavigation
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onPrevious={handlePrevious}
          onNext={handleNext}
          mode="month"
        />

        {isLoading ? (
          <div className="bg-card rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">Lade Events...</p>
          </div>
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

      <FloatingActionButton onClick={() => setIsCreateDialogOpen(true)} />

      <DayDetailSheet
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        selectedDate={selectedDate}
        events={events}
        onEventClick={setEditingEvent}
      />

      <EventDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={refreshEvents}
        mode="create"
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