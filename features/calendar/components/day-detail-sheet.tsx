"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Event } from "@/features/events/queries";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { formatTime } from "../utils";

type DayDetailSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
};

export function DayDetailSheet({
  open,
  onOpenChange,
  selectedDate,
  events,
  onEventClick,
}: DayDetailSheetProps) {
  const selectedEvents = events
    .filter((event) => {
      const eventDate = parseISO(event.start_time);
      return (
        eventDate.getFullYear() === selectedDate.getFullYear() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getDate() === selectedDate.getDate()
      );
    })
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!left-0 !right-0 !top-auto !bottom-0 !translate-x-0 !translate-y-0 max-w-none rounded-b-none rounded-t-2xl p-4 pb-8">
        <DialogHeader className="pr-6">
          <DialogTitle>{format(selectedDate, "EEEE, d. MMMM", { locale: de })}</DialogTitle>
          <DialogDescription>Tagesdetails in der Monatsansicht</DialogDescription>
        </DialogHeader>

        <div className="max-h-[55dvh] overflow-y-auto space-y-2">
          {selectedEvents.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              Keine Events an diesem Tag
            </div>
          ) : (
            selectedEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => onEventClick(event)}
                className="w-full rounded-lg border bg-card p-3 text-left hover:bg-muted/40 transition-colors"
              >
                <div className="font-semibold text-sm">{event.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </div>
                {event.description && (
                  <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{event.description}</div>
                )}
              </button>
            ))
          )}
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Tippe auf ein Event, um es zu bearbeiten.
        </div>
      </DialogContent>
    </Dialog>
  );
}
