"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from "./event-form";
import type { Event } from "../queries";

type EventDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  event?: Event;
  onSuccess?: () => void;
};

export function EventDialog({
  open,
  onOpenChange,
  mode,
  event,
  onSuccess,
}: EventDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
    // Defer refresh until after dialog transition completes
    setTimeout(() => {
      onSuccess?.();
    }, 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Neues Event erstellen" : "Event bearbeiten"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Füge ein neues Event zu deinem Kalender hinzu."
              : "Bearbeite die Details deines Events."}
          </DialogDescription>
        </DialogHeader>
        <EventForm mode={mode} event={event} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
