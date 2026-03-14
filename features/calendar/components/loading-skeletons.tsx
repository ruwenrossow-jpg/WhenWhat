export function DayTimelineSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-4 space-y-4 calendar-view-transition" aria-hidden="true">
      <div className="h-6 w-40 rounded-md calendar-skeleton" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="h-4 w-12 rounded calendar-skeleton" />
            <div className="h-10 flex-1 rounded-lg calendar-skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeekTimelineSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-3 calendar-view-transition" aria-hidden="true">
      <div className="grid grid-cols-7 gap-2 mb-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="h-12 rounded-lg calendar-skeleton" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 7 }).map((_, row) => (
          <div key={row} className="grid grid-cols-8 gap-2">
            <div className="h-8 rounded calendar-skeleton" />
            {Array.from({ length: 7 }).map((_, col) => (
              <div key={col} className="h-8 rounded calendar-skeleton" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonthGridSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-3 calendar-view-transition" aria-hidden="true">
      <div className="grid grid-cols-7 gap-2 mb-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="h-6 rounded calendar-skeleton" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 42 }).map((_, index) => (
          <div key={index} className="h-16 rounded-lg calendar-skeleton" />
        ))}
      </div>
    </div>
  );
}
