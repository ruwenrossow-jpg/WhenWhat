"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ui/color-picker";
import { createEvent, updateEvent } from "../actions";
import { useActionState, useEffect, useState } from "react";
import type { Event } from "../queries";
import type { EventColorId } from "@/lib/design/tokens";

const DURATION_PRESETS = [
  { label: "+30m", minutes: 30 },
  { label: "+1h", minutes: 60 },
  { label: "+2h", minutes: 120 },
];

const WEEKDAYS = [
  { value: 1, label: "Mo" },
  { value: 2, label: "Di" },
  { value: 3, label: "Mi" },
  { value: 4, label: "Do" },
  { value: 5, label: "Fr" },
  { value: 6, label: "Sa" },
  { value: 7, label: "So" },
];

type EventFormProps = {
  mode: "create" | "edit";
  event?: Event;
  onSuccess?: () => void;
  initialValues?: {
    title?: string;
    description?: string;
    start_time?: string;
    end_time?: string;
    color?: EventColorId;
  };
};

export function EventForm({ mode, event, onSuccess, initialValues }: EventFormProps) {
  const action = mode === "create" ? createEvent : updateEvent;
  const [state, formAction, isPending] = useActionState(action, undefined);
  const [selectedColor, setSelectedColor] = useState<EventColorId>(
    (event?.color as EventColorId) ?? initialValues?.color ?? 'primary'
  );
  const [recurrenceType, setRecurrenceType] = useState<"none" | "daily" | "weekly" | "monthly">(
    event?.is_recurring && event.recurrence_type ? event.recurrence_type : "none"
  );
  const [editScope, setEditScope] = useState<"single" | "series">(
    event?.is_recurring_instance ? "single" : "series"
  );

  useEffect(() => {
    if (state?.success && onSuccess) {
      onSuccess();
    }
  }, [state, onSuccess]);

  const toLocalDateTimeValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Format datetime-local values
  const formatDateTimeLocal = (date: string) => {
    return toLocalDateTimeValue(new Date(date));
  };

  // Default times for new events (now + 1 hour for start, now + 2 hours for end)
  const getDefaultStartTime = () => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 1);
    return toLocalDateTimeValue(now);
  };

  const getDefaultEndTime = () => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 2);
    return toLocalDateTimeValue(now);
  };

  const defaultStartTime = event?.start_time
    ? formatDateTimeLocal(event.start_time)
    : initialValues?.start_time ?? getDefaultStartTime();
  const defaultEndTime = event?.end_time
    ? formatDateTimeLocal(event.end_time)
    : initialValues?.end_time ?? getDefaultEndTime();

  const [startTimeValue, setStartTimeValue] = useState(defaultStartTime);
  const [endTimeValue, setEndTimeValue] = useState(defaultEndTime);
  const [isEndManuallyAdjusted, setIsEndManuallyAdjusted] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "create") {
      return;
    }

    setStartTimeValue(defaultStartTime);
    setEndTimeValue(defaultEndTime);
    setSelectedColor(initialValues?.color ?? "primary");
    setIsEndManuallyAdjusted(false);
  }, [defaultEndTime, defaultStartTime, initialValues?.color, mode]);

  const addMinutesToLocalValue = (value: string, minutes: number) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    date.setMinutes(date.getMinutes() + minutes);
    return toLocalDateTimeValue(date);
  };

  const getMinutesDifference = (startValue: string, endValue: string) => {
    const start = new Date(startValue);
    const end = new Date(endValue);
    return Math.max(30, Math.round((end.getTime() - start.getTime()) / 60000));
  };

  const handleStartTimeChange = (nextValue: string) => {
    const currentDuration = getMinutesDifference(startTimeValue, endTimeValue);
    setStartTimeValue(nextValue);

    if (!isEndManuallyAdjusted) {
      setEndTimeValue(addMinutesToLocalValue(nextValue, currentDuration));
    }
  };

  const applyDurationPreset = (minutes: number) => {
    setEndTimeValue(addMinutesToLocalValue(startTimeValue, minutes));
    setIsEndManuallyAdjusted(false);
  };

  return (
    <form action={formAction} className="space-y-4">
      {mode === "edit" && event && (
        <>
          <input type="hidden" name="id" value={event.source_event_id ?? event.id} />
          {event.source_event_id && (
            <input type="hidden" name="source_event_id" value={event.source_event_id} />
          )}
          {event.occurrence_date && (
            <input type="hidden" name="occurrence_date" value={event.occurrence_date} />
          )}
          <input type="hidden" name="edit_scope" value={editScope} />
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Titel *</Label>
        <Input
          id="title"
          name="title"
          placeholder="z.B. Meeting mit Anna"
          required
          maxLength={200}
          defaultValue={event?.title ?? initialValues?.title ?? ""}
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
          defaultValue={event?.description ?? initialValues?.description ?? ""}
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
            value={startTimeValue}
            onChange={(event) => handleStartTimeChange(event.target.value)}
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
            value={endTimeValue}
            onChange={(event) => {
              setEndTimeValue(event.target.value);
              setIsEndManuallyAdjusted(true);
            }}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Schnelle Dauer</Label>
        <div className="flex flex-wrap gap-2">
          {DURATION_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyDurationPreset(preset.minutes)}
              disabled={isPending}
              className="calendar-interactive rounded-full"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recurrence_type">Wiederholung</Label>
        <select
          id="recurrence_type"
          name="recurrence_type"
          value={recurrenceType}
          onChange={(e) => setRecurrenceType(e.target.value as "none" | "daily" | "weekly" | "monthly")}
          disabled={isPending}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="none">Keine Wiederholung</option>
          <option value="daily">Täglich</option>
          <option value="weekly">Wöchentlich</option>
          <option value="monthly">Monatlich</option>
        </select>
      </div>

      {recurrenceType !== "none" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recurrence_interval">Intervall</Label>
              <Input
                id="recurrence_interval"
                name="recurrence_interval"
                type="number"
                min={1}
                max={12}
                defaultValue={event?.recurrence_interval ?? 1}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurrence_until">Serienende</Label>
              <Input
                id="recurrence_until"
                name="recurrence_until"
                type="date"
                defaultValue={event?.recurrence_until ?? ""}
                disabled={isPending}
              />
            </div>
          </div>

          {recurrenceType === "weekly" && (
            <div className="space-y-2">
              <Label>Wochentage</Label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((day) => {
                  const checked = (event?.recurrence_days ?? []).includes(day.value);
                  return (
                    <label key={day.value} className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs">
                      <input
                        type="checkbox"
                        name="recurrence_days"
                        value={day.value}
                        defaultChecked={checked}
                        disabled={isPending}
                      />
                      {day.label}
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {mode === "edit" && event?.is_recurring_instance && (
        <div className="space-y-2">
          <Label htmlFor="edit_scope">Änderung anwenden auf</Label>
          <select
            id="edit_scope"
            value={editScope}
            onChange={(e) => setEditScope(e.target.value as "single" | "series")}
            disabled={isPending}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="single">Nur diesen Termin</option>
            <option value="series">Gesamte Serie</option>
          </select>
        </div>
      )}

      {state?.error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {state.error}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        {mode === "edit" && (
          <Button
            type="submit"
            name="_intent"
            value="delete"
            variant="destructive"
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Löschen..." : "Löschen"}
          </Button>
        )}
        <Button type="submit" name="_intent" value="save" disabled={isPending} className="w-full sm:w-auto">
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
