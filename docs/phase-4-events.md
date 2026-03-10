# Phase 4: Event CRUD

## Ziel
Vollständige Create, Read, Update, Delete Funktionalität für Events.

## Voraussetzungen
- ✅ Auth funktioniert
- ✅ Supabase Events-Tabelle existiert
- ✅ Basis Server Actions existieren

## Tasks

### 4.1 Event Form Component
**File**: `features/events/components/event-form.tsx`

- [ ] Reusable EventForm für Create & Edit
- [ ] Title Input (required, max 200)
- [ ] Description Textarea (optional)
- [ ] Start Time Input (datetime-local)
- [ ] End Time Input (datetime-local)
- [ ] Validierung mit Zod Schema
- [ ] Submit Handler mit Server Action
- [ ] Loading State während Submit
- [ ] Error Handling & Display

### 4.2 Event Card Component
**File**: `features/events/components/event-card.tsx`

- [ ] Event Display mit Titel, Zeit, Beschreibung
- [ ] Edit Button → öffnet Dialog mit EventForm
- [ ] Delete Button mit Confirmation
- [ ] Mobile-optimiertes Layout

### 4.3 Event Dialog
**File**: `features/events/components/event-dialog.tsx`

- [ ] shadcn/ui Dialog Component
- [ ] EventForm eingebettet
- [ ] Create Mode & Edit Mode
- [ ] Öffnen via Floating Action Button (Day View)
- [ ] Öffnen via Event-Card Edit Button

### 4.4 Integration in Views
- [ ] Day View: FAB zum Event erstellen
- [ ] Day View: Events anzeigen mit EventCard
- [ ] Week View: FAB zum Event erstellen
- [ ] Week View: Events anzeigen kompakt

### 4.5 Testing
- [ ] Event erstellen funktioniert
- [ ] Event wird in Supabase gespeichert
- [ ] Event erscheint in Day/Week View
- [ ] Event bearbeiten funktioniert
- [ ] Event löschen funktioniert
- [ ] RLS: Andere User können meine Events nicht sehen
- [ ] Validierung: Fehlermeldungen werden angezeigt

## Copilot Prompt (wenn bereit)

```
Implementiere Event CRUD für WhenWhat:

1. Erstelle EventForm Component (features/events/components/event-form.tsx)
   - Props: mode (create|edit), event (optional), onSuccess
   - Fields: title, description, start_time, end_time
   - Nutze shadcn/ui Input, Textarea, Button
   - Client Component mit useActionState für Server Actions
   - Validierung mit features/events/schemas.ts

2. Erstelle EventCard Component (features/events/components/event-card.tsx)
   - Zeigt Event-Daten an
   - Edit Button öffnet Dialog
   - Delete Button mit Confirmation Dialog
   - Mobile-optimiert

3. Erstelle EventDialog Component (features/events/components/event-dialog.tsx)
   - shadcn/ui Dialog
   - EventForm eingebettet
   - Steuerbar via Props (open, onOpenChange)

4. Floating Action Button für Create Event
   - Positioning: fixed bottom-right
   - Plus Icon
   - Öffnet EventDialog im Create Mode

Alle Components mobile-first, Errors anzeigen, Loading States.
```

## Definition of Done
- Event erstellen, bearbeiten, löschen funktioniert
- Events werden in Supabase gespeichert
- UI ist responsive und mobile-optimiert
- Validierung funktioniert (Client & Server)
- Error Handling ist user-friendly
- Loading States sind sichtbar
