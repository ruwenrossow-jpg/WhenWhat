import type { Event } from "./queries";

type CalendarScope = "day" | "week" | "month";

const EVENT_CACHE_MAX_AGE_MS = 10 * 60 * 1000;

const eventCache = new Map<string, { createdAt: number; events: Event[] }>();
const inFlightPrefetch = new Map<string, Promise<void>>();

const buildCacheKey = (scope: CalendarScope, date: string) => `${scope}:${date}`;

export const getCachedEvents = (
  scope: CalendarScope,
  date: string,
  maxAgeMs: number = EVENT_CACHE_MAX_AGE_MS
) => {
  const key = buildCacheKey(scope, date);
  const cached = eventCache.get(key);

  if (!cached) {
    return undefined;
  }

  if (Date.now() - cached.createdAt > maxAgeMs) {
    eventCache.delete(key);
    return undefined;
  }

  return cached.events;
};

export const setCachedEvents = (scope: CalendarScope, date: string, events: Event[]) => {
  eventCache.set(buildCacheKey(scope, date), {
    createdAt: Date.now(),
    events,
  });
};

export const invalidateCachedEvents = (scope: CalendarScope, date: string) => {
  eventCache.delete(buildCacheKey(scope, date));
};

export const fetchEventsFromApi = async (
  scope: CalendarScope,
  date: string,
  options?: { signal?: AbortSignal; cache?: RequestCache }
): Promise<{ kind: "success"; events: Event[] } | { kind: "auth" } | { kind: "error" }> => {
  const response = await fetch(`/api/events/${scope}?date=${date}`, {
    signal: options?.signal,
    cache: options?.cache ?? "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    return { kind: "auth" };
  }

  if (!response.ok) {
    return { kind: "error" };
  }

  const events = (await response.json()) as Event[];
  setCachedEvents(scope, date, events);
  return { kind: "success", events };
};

export const prefetchEvents = async (scope: CalendarScope, date: string) => {
  if (getCachedEvents(scope, date)) {
    return;
  }

  const key = buildCacheKey(scope, date);
  if (inFlightPrefetch.has(key)) {
    return inFlightPrefetch.get(key);
  }

  const request = (async () => {
    try {
      await fetchEventsFromApi(scope, date, { cache: "force-cache" });
    } finally {
      inFlightPrefetch.delete(key);
    }
  })();

  inFlightPrefetch.set(key, request);
  return request;
};
