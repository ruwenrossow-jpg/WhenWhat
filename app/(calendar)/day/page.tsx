"use client";

import { Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EventDialog } from "@/features/events/components/event-dialog";
import { FloatingActionButton } from "@/features/events/components/floating-action-button";
import { DateNavigation } from "@/features/calendar/components/date-navigation";
import { DayTimeline } from "@/features/calendar/components/day-timeline";
import type { Event } from "@/features/events/queries";
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
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh events list
  const refreshEvents = () => setRefreshKey((prev) => prev + 1);

  // Update URL when date changes
  useEffect(() => {
    const dateStr = formatDateForURL(currentDate);
    router.push(`/day?date=${dateStr}`, { scroll: false });
  }, [currentDate, router]);

  // Fetch events for current day
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/events/day?date=${formatDateForURL(currentDate)}`,
          { signal: abortController.signal }
        );
        
        // Check for authentication errors
        if (response.status === 401 || response.status === 403) {
          console.error("Authentication failed, redirecting to login");
          router.push("/login");
          return;
        }
        
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          setError("Events konnten nicht geladen werden");
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Error fetching events:", error);
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

  const handlePrevious = () => setCurrentDate(getPreviousDay(currentDate));
  const handleNext = () => setCurrentDate(getNextDay(currentDate));

  return (
    <>
      <div className="space-y-4 pb-20">
        <DateNavigation
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onPrevious={handlePrevious}
          onNext={handleNext}
          mode="day"
        />

        {isLoading ? (
          <div className="bg-card rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">Lade Events...</p>
          </div>
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
              events={events}
              onEventEdit={setEditingEvent}
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

      <FloatingActionButton onClick={() => setIsCreateDialogOpen(true)} />

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
