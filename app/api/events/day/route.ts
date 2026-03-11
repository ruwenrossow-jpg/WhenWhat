import { NextRequest, NextResponse } from "next/server";
import { getEventsForDay } from "@/features/events/queries";
import { parseDateFromURL } from "@/features/calendar/utils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get("date");

    const date = dateParam ? parseDateFromURL(dateParam) : new Date();

    const events = await getEventsForDay(date);

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error in /api/events/day:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: "Failed to fetch events",
          message: error.message,
          code: "FETCH_FAILED"
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
