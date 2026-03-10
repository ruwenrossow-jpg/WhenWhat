"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ui/color-picker";
import { createEvent, updateEvent, type EventActionState } from "../actions";
import { useActionState, useEffect, useState } from "react";
import type { Event } from "../queries";
import type { EventColorId } from "@/lib/design/tokens";

type EventFormProps = {
  mode: "create" | "edit";
  event?: Event;
  onSuccess?: () => void;
};

export function EventForm({ mode, event, onSuccess }: EventFormProps) {
  const action = mode === "create" ? createEvent : updateEvent;
  const [state, formAction, isPending] = useActionState(action, undefined);
  const [selectedColor, setSelectedColor] = useState<EventColorId>(
    (event?.color as EventColorId) ?? 'primary'
  );

  useEffect(() => {
    if (state?.success && onSuccess) {
      onSuccess();
    }
  }, [state, onSuccess]);

  // Format datetime-local values
  const formatDateTimeLocal = (date: string) => {
    return new Date(date).toISOString().slice(0, 16);
  };

  // Default times for new events (now + 1 hour for start, now + 2 hours for end)
  const getDefaultStartTime = () => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  const getDefaultEndTime = () => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 2);
    return now.toISOString().slice(0, 16);
  };

  const defaultStartTime = event?.start_time
    ? formatDateTimeLocal(event.start_time)
    : getDefaultStartTime();
  const defaultEndTime = event?.end_time
    ? formatDateTimeLocal(event.end_time)
    : getDefaultEndTime();

  return (
    <form action={formAction} className="space-y-4">
      {mode === "edit" && event && (
        <input type="hidden" name="id" value={event.id} />
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Titel *</Label>
        <Input
          id="title"
          name="title"
          placeholder="z.B. Meeting mit Anna"
          required
          maxLength={200}
          defaultValue={event?.title}
          disabled={isPending}
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beschreibung</Label>
        <textarea
          id="description"
          name="description"
          placeholder="Optional: Details zum Event"
          rows={3}
          defaultValue={event?.description || ""}
          disabled={isPending}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <Label>Farbe</Label>
        <ColorPicker 
          value={selectedColor} 
          onChange={setSelectedColor} 
          name="color" 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_time">Start *</Label>
          <Input
            id="start_time"
            name="start_time"
            type="datetime-local"
            required
            defaultValue={defaultStartTime}
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">Ende *</Label>
          <Input
            id="end_time"
            name="end_time"
            type="datetime-local"
            required
            defaultValue={defaultEndTime}
            disabled={isPending}
          />
        </div>
      </div>

      {state?.error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {state.error}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending
            ? mode === "create"
              ? "Erstellen..."
              : "Speichern..."
            : mode === "create"
            ? "Event erstellen"
            : "Änderungen speichern"}
        </Button>
      </div>
    </form>
  );
}
