# WhenWhat - Solo Calendar MVP

Mobile-first Kalender WebApp für persönliche Events.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Deployment**: Vercel

## Projekt-Setup

### 1. Dependencies installieren

```bash
npm install
```

### 2. Supabase konfigurieren

Folge der Anleitung in [supabase/README.md](supabase/README.md):

1. Neues Supabase Projekt erstellen
2. SQL Schema ausführen
3. `.env.local` mit Keys füllen

```bash
cp .env.local.example .env.local
# Fülle die Werte aus Supabase Dashboard ein
```

### 3. Dev Server starten

```bash
npm run dev
```

App läuft auf [http://localhost:3000](http://localhost:3000)

## Projektstruktur

```
app/                    # Next.js App Router
├── (auth)/            # Auth-Routen (Login/Signup)
└── (calendar)/        # Kalender-Routen (Day/Week Views)

features/              # Feature-Slices
├── auth/             # Auth-Logik
├── events/           # Event CRUD
└── calendar/         # Kalender-Views

lib/                  # Shared Utilities
├── supabase/        # Supabase Clients
└── utils.ts         # Helpers

components/
└── ui/              # shadcn/ui Components
```

## Development Roadmap

### ✅ Phase 1: Foundation Setup
- [x] Next.js Projekt initialisiert
- [x] shadcn/ui konfiguriert
- [x] Dependencies installiert
- [x] Projektstruktur angelegt
- [x] Supabase Client Setup
- [x] Middleware & Auth-Basis

### 🚧 Phase 2: Supabase Setup (Parallel)
- [ ] Supabase Projekt erstellen
- [ ] SQL Schema ausführen
- [ ] Environment Variables konfigurieren

### 📋 Phase 3: Auth Implementation
- [ ] Login Page implementieren
- [ ] Signup Page implementieren
- [ ] Logout Funktionalität
- [ ] Auth State Management
- [ ] Protected Routes testen

### 📋 Phase 4: Event CRUD
- [ ] Event Form Component
- [ ] Create Event Action
- [ ] Update Event Action
- [ ] Delete Event Action
- [ ] Validierung & Error Handling

### 📋 Phase 5: Calendar Views
- [ ] Day View mit Timeline
- [ ] Week View mit Grid
- [ ] Date Navigation
- [ ] Event Display
- [ ] Loading/Empty/Error States

### 📋 Phase 6: Mobile UX Polish
- [ ] Touch-optimierte Controls
- [ ] Responsive Design verfeinern
- [ ] Smooth Animations
- [ ] Native-feel Navigation

### 📋 Phase 7: Deployment
- [ ] Vercel Projekt setup
- [ ] Environment Variables
- [ ] Production Build testen
- [ ] Domain verbinden (optional)

## Scripts

```bash
npm run dev      # Dev Server
npm run build    # Production Build
npm run start    # Production Server
npm run lint     # ESLint
```

## Nächste Schritte

1. ✅ **Foundation ist fertig!**
2. **Supabase Setup parallel durchführen** (siehe [supabase/README.md](supabase/README.md))
3. Nach Supabase Setup: Phase 3 (Auth) implementieren

## Features (MVP Scope)

**P0 - Must Have:**
- ✅ Projekt-Setup & Foundation
- ⏳ Supabase Auth (Email/Password)
- ⏳ Event erstellen, bearbeiten, löschen
- ⏳ Day View (Tagesansicht)
- ⏳ Week View (Wochenansicht)
- ⏳ Mobile-first responsive Design
- ⏳ Supabase RLS Security

**P1 - Nice to Have (Post-MVP):**
- Month View
- Event-Kategorien/Tags
- Wiederholende Events
- Event-Suche
- Dark Mode Toggle

**Out of Scope:**
- ❌ Social Features
- ❌ Follower/Following
- ❌ Feed/Discovery
- ❌ Andere User
- ❌ Gruppen/Communities

## Architektur-Prinzipien

- **KISS vor Cleverness**: Einfache Lösungen bevorzugen
- **Foundation vor Features**: Stabiles Fundament erst
- **Mobile-First**: Primär für mobile Nutzung optimiert
- **Feature-Slices**: Logik nach Features organisiert
- **Zod an Boundaries**: Input-Validierung an Einstiegspunkten
- **SSR + Server Actions**: Saubere Next.js Patterns

## Support

Bei Fragen oder Problemen: GitHub Issues oder direkt melden.

---

**Status**: 🏗️ In Development - Phase 1 Complete
