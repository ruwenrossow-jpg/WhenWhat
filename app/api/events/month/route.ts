import { NextRequest, NextResponse } from "next/server";
import { getEventsForMonth } from "@/features/events/queries";
import { parseDateFromURL } from "@/features/calendar/utils";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get("date");

    const date = dateParam ? parseDateFromURL(dateParam) : new Date();
    const events = await getEventsForMonth(date);

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error in /api/events/month:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to fetch events",
          message: error.message,
          code: "FETCH_FAILED",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
