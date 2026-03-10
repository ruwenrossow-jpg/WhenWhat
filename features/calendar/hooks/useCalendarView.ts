"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Event } from "@/features/events/queries";
import {
  getToday,
  formatDateForURL,
  parseDateFromURL,
} from "@/features/calendar/utils";

export function useCalendarView(mode: "day" | "week") {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Date from URL (single source of truth)
  const currentDate = useMemo(() => {
    const dateParam = searchParams.get("date");
    return dateParam ? parseDateFromURL(dateParam) : getToday();
  }, [searchParams]);

  // State
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh events
  const refreshEvents = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // Update URL when date changes
  const navigate = useCallback(
    (date: Date) => {
      const dateStr = formatDateForURL(date);
      router.push(`/${mode}?date=${dateStr}`, { scroll: false });
    },
    [mode, router]
  );

  // Fetch events
  useEffect(() => {
    const abortController = new AbortController();

    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/events/${mode}?date=${formatDateForURL(currentDate)}`,
          { signal: abortController.signal }
        );
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          setError("Events konnten nicht geladen werden");
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
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
  }, [currentDate, refreshKey, mode]);

  return {
    currentDate,
    navigate,
    events,
    isLoading,
    error,
    refreshEvents,
    dialog: {
      isCreateOpen: isCreateDialogOpen,
      setIsCreateOpen: setIsCreateDialogOpen,
      editingEvent,
      setEditingEvent,
    },
  };
}
