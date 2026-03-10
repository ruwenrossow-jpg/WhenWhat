import { createClient } from "@/lib/supabase/server";

export type Event = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  color: string;
  created_at: string;
  updated_at: string;
};

/**
 * Holt alle Events für einen bestimmten Tag
 */
export async function getEventsForDay(date: Date): Promise<Event[]> {
  const supabase = await createClient();

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("start_time", startOfDay.toISOString())
    .lte("start_time", endOfDay.toISOString())
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching events for day:", error);
    return [];
  }

  return data || [];
}

/**
 * Holt alle Events für eine Woche
 */
export async function getEventsForWeek(startDate: Date): Promise<Event[]> {
  const supabase = await createClient();

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("start_time", startDate.toISOString())
    .lte("start_time", endDate.toISOString())
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching events for week:", error);
    return [];
  }

  return data || [];
}

/**
 * Holt ein einzelnes Event per ID
 */
export async function getEventById(eventId: string): Promise<Event | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error) {
    console.error("Error fetching event:", error);
    return null;
  }

  return data;
}
