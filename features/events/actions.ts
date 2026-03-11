"use server";

import { createClient } from "@/lib/supabase/server";
import { createEventSchema, updateEventSchema } from "./schemas";
import { revalidatePath } from "next/cache";

export type EventActionState = {
  error?: string;
  success?: boolean;
} | undefined;

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
    ...validation.data,
  };

  console.log("[createEvent] Inserting into database:", insertData);

  const { error } = await supabase.from("events").insert(insertData);

  if (error) {
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

  revalidatePath("/day");
  revalidatePath("/week");

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
  };

  const validation = updateEventSchema.safeParse(data);

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { id, ...updateData } = validation.data;

  const { error } = await supabase
    .from("events")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("[updateEvent] Database error:", error);
    return { error: "Event konnte nicht aktualisiert werden. Bitte versuche es erneut." };
  }

  revalidatePath("/day");
  revalidatePath("/week");

  return { success: true };
}

export async function deleteEvent(eventId: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) {
    console.error("[deleteEvent] Database error:", error);
    return { error: "Event konnte nicht gelöscht werden. Bitte versuche es erneut." };
  }

  revalidatePath("/day");
  revalidatePath("/week");

  return { success: true };
}
