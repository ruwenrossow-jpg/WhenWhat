"use server";

import { createClient } from "@/lib/supabase/server";
import { createEventSchema, updateEventSchema } from "./schemas";
import { revalidatePath } from "next/cache";

export type EventActionState = {
  error?: string;
  success?: boolean;
} | undefined;

type RecurrencePayload = {
  is_recurring: boolean;
  recurrence_type: "daily" | "weekly" | "monthly" | null;
  recurrence_interval: number | null;
  recurrence_days: number[] | null;
  recurrence_until: string | null;
};

function isSchemaMismatchError(error: { code?: string } | null): boolean {
  if (!error?.code) {
    return false;
  }

  return error.code === "42703" || error.code === "42P01";
}

function recurrenceMigrationHint(): string {
  return "Recurrence-Setup fehlt in der Datenbank. Bitte zuerst supabase/migration-add-recurrence.sql ausführen.";
}

function parseRecurrenceDays(formData: FormData): number[] {
  const values = formData.getAll("recurrence_days");
  return values
    .map((value) => Number.parseInt(value.toString(), 10))
    .filter((value) => Number.isInteger(value) && value >= 1 && value <= 7);
}

function buildRecurrencePayload(validated: {
  recurrence_type: "none" | "daily" | "weekly" | "monthly";
  recurrence_interval: number;
  recurrence_until?: string;
  recurrence_days?: number[];
}): RecurrencePayload {
  if (validated.recurrence_type === "none") {
    return {
      is_recurring: false,
      recurrence_type: null,
      recurrence_interval: null,
      recurrence_days: null,
      recurrence_until: null,
    };
  }

  return {
    is_recurring: true,
    recurrence_type: validated.recurrence_type,
    recurrence_interval: validated.recurrence_interval,
    recurrence_days: validated.recurrence_type === "weekly" ? (validated.recurrence_days ?? null) : null,
    recurrence_until: validated.recurrence_until ? validated.recurrence_until : null,
  };
}

function revalidateCalendarViews() {
  revalidatePath("/day");
  revalidatePath("/week");
  revalidatePath("/month");
}

export async function createEvent(_prevState: unknown, formData: FormData): Promise<EventActionState> {
  const supabase = await createClient();

  console.log("[createEvent] Starting event creation...");

  // Safe FormData extraction with null checks
  const data = {
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    start_time: formData.get("start_time")?.toString() ?? "",
    end_time: formData.get("end_time")?.toString() ?? "",
    color: formData.get("color")?.toString() ?? "primary",
    recurrence_type: formData.get("recurrence_type")?.toString() ?? "none",
    recurrence_interval: formData.get("recurrence_interval")?.toString() ?? "1",
    recurrence_until: formData.get("recurrence_until")?.toString() ?? "",
    recurrence_days: parseRecurrenceDays(formData),
  };

  console.log("[createEvent] Form data:", data);

  const validation = createEventSchema.safeParse(data);

  if (!validation.success) {
    console.error("[createEvent] Validation error:", validation.error.issues);
    return { error: validation.error.issues[0].message };
  }

  console.log("[createEvent] Validation successful:", validation.data);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("[createEvent] User not authenticated");
    return { error: "Nicht authentifiziert" };
  }

  console.log("[createEvent] User authenticated:", user.id);

  const insertData = {
    user_id: user.id,
    title: validation.data.title,
    description: validation.data.description,
    start_time: validation.data.start_time,
    end_time: validation.data.end_time,
    color: validation.data.color,
    ...buildRecurrencePayload(validation.data),
  };

  console.log("[createEvent] Inserting into database:", insertData);

  const { error } = await supabase.from("events").insert(insertData);

  if (error) {
    if (isSchemaMismatchError(error)) {
      if (validation.data.recurrence_type !== "none") {
        return { error: recurrenceMigrationHint() };
      }

      // Fallback for one-off events when recurrence columns are not yet migrated.
      const legacyInsert = {
        user_id: user.id,
        title: validation.data.title,
        description: validation.data.description,
        start_time: validation.data.start_time,
        end_time: validation.data.end_time,
        color: validation.data.color,
      };

      const { error: legacyError } = await supabase.from("events").insert(legacyInsert);
      if (!legacyError) {
        revalidateCalendarViews();
        return { success: true };
      }

      console.error("[createEvent] Legacy insert failed:", legacyError);
      return { error: recurrenceMigrationHint() };
    }

    console.error("[createEvent] Database error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    
    // In development, show detailed error
    if (process.env.NODE_ENV === 'development') {
      return { error: `Datenbank-Fehler: ${error.message} (Code: ${error.code})` };
    }
    
    return { error: "Event konnte nicht gespeichert werden. Bitte versuche es erneut." };
  }

  console.log("[createEvent] Event successfully created");

  revalidateCalendarViews();

  return { success: true };
}

export async function updateEvent(_prevState: unknown, formData: FormData): Promise<EventActionState> {
  const supabase = await createClient();

  // Safe FormData extraction with null checks
  const data = {
    id: formData.get("id")?.toString() ?? "",
    title: formData.get("title")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    start_time: formData.get("start_time")?.toString() ?? "",
    end_time: formData.get("end_time")?.toString() ?? "",
    color: formData.get("color")?.toString() ?? "primary",
    recurrence_type: formData.get("recurrence_type")?.toString() ?? "none",
    recurrence_interval: formData.get("recurrence_interval")?.toString() ?? "1",
    recurrence_until: formData.get("recurrence_until")?.toString() ?? "",
    recurrence_days: parseRecurrenceDays(formData),
    source_event_id: formData.get("source_event_id")?.toString() ?? undefined,
    occurrence_date: formData.get("occurrence_date")?.toString() ?? undefined,
    edit_scope: formData.get("edit_scope")?.toString() ?? "series",
    _intent: formData.get("_intent")?.toString() ?? "save",
  };

  const validation = updateEventSchema.safeParse(data);

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const {
    id,
    source_event_id,
    occurrence_date,
    edit_scope,
    _intent,
    recurrence_type,
    recurrence_interval,
    recurrence_until,
    recurrence_days,
    ...rest
  } = validation.data;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Nicht authentifiziert" };
  }

  const targetEventId = source_event_id ?? id;

  if (_intent === "delete") {
    if (edit_scope === "single" && source_event_id && occurrence_date) {
      const { error } = await supabase
        .from("event_recurrence_exceptions")
        .upsert(
          {
            event_id: source_event_id,
            user_id: user.id,
            occurrence_date,
            is_deleted: true,
            title: null,
            description: null,
            start_time: null,
            end_time: null,
            color: null,
          },
          { onConflict: "event_id,occurrence_date" }
        );

      if (error) {
        if (isSchemaMismatchError(error)) {
          return { error: recurrenceMigrationHint() };
        }

        console.error("[updateEvent:delete single] Database error:", error);
        return { error: "Termin konnte nicht gelöscht werden." };
      }
    } else {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", targetEventId)
        .eq("user_id", user.id);

      if (error) {
        if (isSchemaMismatchError(error)) {
          return { error: recurrenceMigrationHint() };
        }

        console.error("[updateEvent:delete series] Database error:", error);
        return { error: "Serie konnte nicht gelöscht werden." };
      }
    }

    revalidateCalendarViews();
    return { success: true };
  }

  const recurrencePayload = buildRecurrencePayload({
    recurrence_type,
    recurrence_interval,
    recurrence_until,
    recurrence_days,
  });

  const updateData = {
    ...rest,
    ...recurrencePayload,
  };

  if (edit_scope === "single" && source_event_id && occurrence_date) {
    const { error } = await supabase
      .from("event_recurrence_exceptions")
      .upsert(
        {
          event_id: source_event_id,
          user_id: user.id,
          occurrence_date,
          is_deleted: false,
          title: rest.title,
          description: rest.description,
          start_time: rest.start_time,
          end_time: rest.end_time,
          color: rest.color,
        },
        { onConflict: "event_id,occurrence_date" }
      );

    if (error) {
      if (isSchemaMismatchError(error)) {
        return { error: recurrenceMigrationHint() };
      }

      console.error("[updateEvent:single] Database error:", error);
      return { error: "Einzelner Termin konnte nicht aktualisiert werden." };
    }
  } else {
    const { error } = await supabase
      .from("events")
      .update(updateData)
      .eq("id", targetEventId)
      .eq("user_id", user.id);

    if (error) {
      if (isSchemaMismatchError(error)) {
        // Fallback for one-off updates when recurrence columns are missing.
        if (recurrence_type !== "none") {
          return { error: recurrenceMigrationHint() };
        }

        const legacyUpdate = {
          title: rest.title,
          description: rest.description,
          start_time: rest.start_time,
          end_time: rest.end_time,
          color: rest.color,
        };

        const { error: legacyError } = await supabase
          .from("events")
          .update(legacyUpdate)
          .eq("id", targetEventId)
          .eq("user_id", user.id);

        if (!legacyError) {
          revalidateCalendarViews();
          return { success: true };
        }

        console.error("[updateEvent] Legacy update failed:", legacyError);
        return { error: recurrenceMigrationHint() };
      }

      console.error("[updateEvent] Database error:", error);
      return { error: "Event konnte nicht aktualisiert werden. Bitte versuche es erneut." };
    }
  }

  revalidateCalendarViews();

  return { success: true };
}

export async function deleteEvent(eventId: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Nicht authentifiziert" };
  }

  const { error } = await supabase.from("events").delete().eq("id", eventId).eq("user_id", user.id);

  if (error) {
    console.error("[deleteEvent] Database error:", error);
    return { error: "Event konnte nicht gelöscht werden. Bitte versuche es erneut." };
  }

  revalidateCalendarViews();

  return { success: true };
}
