# 🎨 Solo Calendar Design System

Zentrale Branding-Verwaltung für schnelle Design-Anpassungen.

## 🚀 Quick Start: Branding ändern

### 1. Farben ändern
Öffne [lib/design/tokens.ts](tokens.ts):
```typescript
colors: {
  currentTime: 'rgb(34, 197, 94)', // 🟢 Grün statt Rot
  eventAccent: 'var(--secondary)',  // Secondary statt Primary
}
```

### 2. Typographie ändern
```typescript
typography: {
  fontFamily: {
    base: 'Inter, sans-serif',     // 🆕 Neue Schriftart
    heading: 'Poppins, sans-serif', // Überschriften anders
  },
  fontSize: {
    xl: '1.5rem', // Größere Überschriften
  },
}
```

### 3. Spacing anpassen
```typescript
spacing: {
  cardPadding: '2rem', // Mehr Platz in Cards
}
```

### 4. Event-Styling ändern
```typescript
borderWidth: {
  eventAccent: '8px', // Dickere Event-Borders
}
```

### 5. Timeline-Konfiguration
Öffne [lib/design/constants.ts](constants.ts):
```typescript
timeline: {
  hourHeightDesktop: 80,  // Größere Stunden-Zeilen
  autoScrollOffset: 3,    // Mehr Kontext beim Auto-Scroll
}
```

## 📦 Komponenten-Usage

### Icon-Komponente
```tsx
import { Icon } from '@/components/ui/icon';

// Statt:
<Clock className="h-4 w-4" />

// Nutze:
<Icon name="clock" size="sm" />
```

### Design-Tokens in Komponenten
```tsx
import { brandTokens, calendarConstants } from '@/lib/design';

// In inline-styles:
style={{ padding: brandTokens.spacing.cardPadding }}

// In Tailwind-Klassen:
className="p-brand-md text-brand-lg shadow-brand-md"
```

### Responsive Timeline-Höhe Hook
```tsx
import { useTimelineHeight } from '@/lib/design/hooks';

function MyTimeline() {
  const hourHeight = useTimelineHeight(); // Auto 50px mobile, 60px desktop
  // ...
}
```

## 🏗️ Architektur

```
lib/design/
├── tokens.ts          ← 🎨 HAUPTKONFIGURATION (hier ändern!)
├── constants.ts       ← 📏 App-Logik-Werte (Timeline, Grid-Größen)
├── icon-registry.ts   ← 🎭 Icon-Verwaltung
├── theme-config.ts    ← ⚙️ Tailwind-Integration
├── hooks.ts           ← React-Hooks für responsive Design
├── types.ts           ← TypeScript-Typen
└── index.ts           ← Export-Hub
```

## 🎨 Tailwind Custom Classes

### Font Sizes
- `text-brand-xs` → 12px
- `text-brand-sm` → 14px (Standard UI)
- `text-brand-base` → 16px
- `text-brand-lg` → 18px
- `text-brand-xl` → 20px
- `text-brand-2xl` → 24px
- `text-brand-3xl` → 30px

### Spacing
- `p-brand-xs` → 8px
- `p-brand-sm` → 12px
- `p-brand-md` → 16px (Standard)
- `p-brand-lg` → 24px
- `p-brand-xl` → 32px
- `p-brand-2xl` → 48px

Auch verfügbar für: `m-`, `gap-`, `space-x-`, `space-y-`

### Shadows
- `shadow-brand-sm` → Subtle shadow
- `shadow-brand-md` → Standard shadow
- `shadow-brand-lg` → Prominent shadow
- `shadow-brand-xl` → Extra prominent

### Border Width
- `border-brand-thin` → 1px
- `border-brand-medium` → 2px
- `border-brand-thick` → 4px (Week-Grid Events)
- `border-brand-event` → 6px (Day-Timeline Events)

### Transitions
- `duration-brand-fast` → 150ms
- `duration-brand-base` → 200ms
- `duration-brand-slow` → 300ms

## 🎯 CSS Custom Properties

Definiert in [app/globals.css](../../app/globals.css):

### Farben
```css
:root {
  --color-current-time: 239 68 68; /* RGB für "Jetzt"-Indicator */
  --color-event-accent: var(--primary); /* Event-Border-Farbe */
}
```

### Utility-Klassen
- `.current-time-line` → Rote Zeitlinie
- `.current-time-dot` → Roter Punkt
- `.current-time-text` → Roter Text für "Jetzt"

### Transitions
```css
:root {
  --transition-fast: 150ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
}
```

## 📋 Verfügbare Icons

Alle Icons sind zentral registriert in [icon-registry.ts](icon-registry.ts):

| Name | Icon | Usage |
|------|------|-------|
| `close` | X | Dialog schließen |
| `previousNav` | ChevronLeft | Zurück navigieren |
| `nextNav` | ChevronRight | Vorwärts navigieren |
| `clock` | Clock | Zeit-Anzeige |
| `calendarDay` | Calendar | Tagesansicht |
| `calendarWeek` | CalendarDays | Wochenansicht |
| `add` | Plus | Event erstellen (FAB) |
| `edit` | Pencil | Event bearbeiten |
| `delete` | Trash2 | Event löschen |
| `logout` | LogOut | Abmelden |
| `description` | FileText | Event-Beschreibung |
| `error` | AlertCircle | Fehler-Anzeige |

## 🔧 Erweiterung

### Neue Farbe hinzufügen
1. **tokens.ts** ergänzen:
```typescript
colors: {
  myNewColor: 'rgb(100, 200, 300)',
}
```

2. **globals.css** Custom Property hinzufügen (optional):
```css
:root {
  --color-my-new: 100 200 300;
}
```

3. **Nutzen in Komponenten**:
```tsx
style={{ color: brandTokens.colors.myNewColor }}
```

### Neues Icon hinzufügen
1. **icon-registry.ts** ergänzen:
```typescript
import { Star } from 'lucide-react';

export const icons = {
  // ... existing
  star: Star,
}
```

2. **Nutzen**:
```tsx
<Icon name="star" size="md" />
```

### Neuen Spacing-Wert hinzufügen
1. **tokens.ts** ergänzen:
```typescript
spacing: {
  // ... existing
  '3xl': '4rem', // 64px
}
```

2. **theme-config.ts** ergänzen:
```typescript
spacing: {
  // ... existing
  'brand-3xl': brandTokens.spacing['3xl'],
}
```

3. **Nutzen**:
```tsx
className="p-brand-3xl"
```

## 🎯 Best Practices

### ✅ DO
- Nutze `<Icon name="..." />` statt direkter Lucide-Imports
- Nutze `text-brand-sm` statt `text-sm` für konsistentes Branding
- Nutze `calendarConstants` für App-spezifische Werte
- Nutze `useTimelineHeight()` Hook für responsive Timeline-Höhen
- Nutze `.current-time-*` Utility-Klassen für "Jetzt"-Indicator

### ❌ DON'T
- Keine hardcoded RGB-Farben wie `bg-[rgb(239,68,68)]`
- Keine hardcoded Größen wie `h-[60px]` (nutze Constants)
- Keine non-standard Font-Größen wie `text-[10px]`
- Keine direkte Lucide-Icon-Imports in Komponenten
- Keine doppelten Werte (DRY-Prinzip)

## 🚀 Schnelles Rebranding - Beispiel

**Ziel:** Von Schwarz/Weiß zu Blau/Grün Theme

1. **globals.css** - Farben ändern:
```css
:root {
  --primary: 217 91% 60%;        /* Blau */
  --secondary: 142 76% 36%;      /* Grün */
  --color-current-time: 34 197 94; /* Grüner Indicator */
}
```

2. **tokens.ts** - Typographie modernisieren:
```typescript
fontFamily: {
  base: 'Inter, system-ui, sans-serif',
  heading: 'Poppins, sans-serif',
},
```

3. **constants.ts** - Timeline großzügiger:
```typescript
timeline: {
  hourHeightDesktop: 80,
  hourHeightMobile: 60,
}
```

4. **tokens.ts** - Events hervorheben:
```typescript
borderWidth: {
  eventAccent: '8px', // Dickere Borders
}
```

5. **npm run dev** → Komplettes Rebranding in <1 Minute! 🎉

## 📚 Weitere Infos

- **Type-Safety**: Alle Tokens sind typsicher mit TypeScript
- **Auto-Completion**: VS Code zeigt alle verfügbaren Token-Namen
- **Hot-Reload**: Änderungen in tokens.ts triggern sofortiges Neu-Laden
- **Dark-Mode**: Bereits vorbereitet in globals.css (`.dark { ... }`)

**Happy Branding! 🎨**
