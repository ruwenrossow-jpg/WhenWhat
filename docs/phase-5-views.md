# Phase 5: Calendar Views

## Ziel
Day View und Week View mit Timeline/Grid-Layout und Event-Display implementieren.

## Voraussetzungen
- ✅ Auth funktioniert
- ✅ Event CRUD funktioniert
- ✅ Events werden in Supabase gespeichert

## Tasks

### 5.1 Date Navigation Component
**File**: `features/calendar/components/date-navigation.tsx`

- [ ] Prev / Today / Next Buttons
- [ ] Aktuelles Datum/Woche anzeigen
- [ ] Mobile-optimiert (Touch-targets min 44px)
- [ ] State Management für aktuelles Datum

### 5.2 Day View Timeline
**File**: `features/calendar/components/day-view.tsx`

- [ ] Timegrid Layout (00:00 - 23:59)
- [ ] Stundeneinteilung sichtbar
- [ ] Events als Cards in Timeline positioniert
- [ ] Event start_time → Y-Position berechnen
- [ ] Event duration → Height berechnen
- [ ] Scrollbar für lange Tage
- [ ] Empty State: "Keine Events für diesen Tag"
- [ ] Loading State während Fetch

### 5.3 Week View Grid
**File**: `features/calendar/components/week-view.tsx`

- [ ] 7-Tages Grid (Mo - So)
- [ ] Datum für jeden Tag anzeigen
- [ ] Events als kompakte Blocks
- [ ] Multi-Event Days: Stacking/Overflow
- [ ] Empty State: "Keine Events diese Woche"
- [ ] Loading State während Fetch

### 5.4 Integration in Pages
**File**: `app/(calendar)/day/page.tsx`

- [ ] DateNavigation einbinden
- [ ] DayView Component einbinden
- [ ] Events für Tag fetchen (SSR via queries.ts)
- [ ] URL Params für Datum (optional)

**File**: `app/(calendar)/week/page.tsx`

- [ ] DateNavigation einbinden
- [ ] WeekView Component einbinden
- [ ] Events für Woche fetchen (SSR via queries.ts)
- [ ] URL Params für Woche (optional)

### 5.5 Calendar Utils
**File**: `features/calendar/utils.ts`

- [ ] getStartOfWeek(date): Date
- [ ] getEndOfWeek(date): Date
- [ ] formatDateHeader(date): string
- [ ] calculateEventPosition(event): {top, height}
- [ ] Weitere Date-Helpers mit date-fns

### 5.6 Testing
- [ ] Day View zeigt Events korrekt an
- [ ] Week View zeigt Events korrekt an
- [ ] Navigation zwischen Tagen/Wochen funktioniert
- [ ] Events an richtigen Positionen
- [ ] Empty States werden angezeigt
- [ ] Loading States während Fetch
- [ ] Mobile: Touch-Navigation funktioniert

## Copilot Prompt (wenn bereit)

```
Implementiere Calendar Views für WhenWhat:

1. DateNavigation Component (features/calendar/components/date-navigation.tsx)
   - Prev/Today/Next Buttons
   - Aktuelles Datum anzeigen
   - Props: date, onDateChange, viewMode (day|week)
   - Mobile-optimiert mit großen Touch-Targets

2. DayView Component (features/calendar/components/day-view.tsx)
   - Timegrid 00:00-23:59 (1h Schritte)
   - Events via Props
   - Positionierung: start_time → top, duration → height
   - EventCard Component nutzen
   - Empty/Loading States

3. WeekView Component (features/calendar/components/week-view.tsx)
   - 7-Spalten Grid (Mo-So)
   - Datum-Header für jeden Tag
   - Events kompakt anzeigen
   - Multi-Event Handling
   - Empty/Loading States

4. Calendar Utils (features/calendar/utils.ts)
   - date-fns nutzen
   - getStartOfWeek, getEndOfWeek
   - formatDateHeader
   - calculateEventPosition

5. Pages aktualisieren
   - app/(calendar)/day/page.tsx: DayView + Navigation
   - app/(calendar)/week/page.tsx: WeekView + Navigation
   - SSR Fetch via features/events/queries.ts

Mobile-first, alle Komponenten responsive.
```

## Definition of Done
- Day View zeigt Timeline mit Events
- Week View zeigt Grid mit Events
- Navigation zwischen Dates funktioniert
- Events werden korrekt positioniert
- Empty & Loading States funktionieren
- Mobile UX ist smooth
- SSR funktioniert (schnelles Initial Load)
