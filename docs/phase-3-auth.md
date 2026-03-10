# Phase 3: Auth Implementation

## Ziel
Vollständige Authentication mit Supabase implementieren.

## Voraussetzungen
- ✅ Supabase Projekt erstellt
- ✅ Schema ausgeführt
- ✅ Environment Variables konfiguriert

## Tasks

### 3.1 Login Page
**File**: `app/(auth)/login/page.tsx`

- [ ] LoginForm Component erstellen
- [ ] Email/Password Inputs mit Validierung
- [ ] Server Action `login` einbinden
- [ ] Error-Handling
- [ ] Link zu Signup Page

### 3.2 Signup Page
**File**: `app/(auth)/signup/page.tsx`

- [ ] SignupForm Component erstellen
- [ ] Email/Password Inputs mit Validierung
- [ ] Server Action `signup` einbinden
- [ ] Error-Handling
- [ ] Link zu Login Page

### 3.3 Logout Funktionalität
**File**: `app/(calendar)/layout.tsx`

- [ ] Navigation Component mit Logout Button
- [ ] Server Action `logout` einbinden
- [ ] User State anzeigen (optional)

### 3.4 Testing
- [ ] Signup Flow testen
- [ ] Login Flow testen
- [ ] Logout Flow testen
- [ ] Protected Routes testen (Middleware sollte zu /login redirecten)
- [ ] RLS testen (Events nur für eigenen User sichtbar)

## Copilot Prompt (wenn bereit)

```
Implementiere die Auth-Flow-Komponenten für WhenWhat:

1. Erstelle LoginForm in app/(auth)/login/page.tsx
   - Nutze shadcn/ui Components (Input, Button, Label)
   - Binde features/auth/actions.ts::login ein
   - Zeige Errors an
   - Link zu /signup

2. Erstelle SignupForm in app/(auth)/signup/page.tsx
   - Nutze shadcn/ui Components
   - Binde features/auth/actions.ts::signup ein
   - Zeige Errors an
   - Link zu /login

3. Erweitere app/(calendar)/layout.tsx
   - Füge Navigation mit Logout-Button hinzu
   - Binde features/auth/actions.ts::logout ein
   - Zeige aktuellen User an

Mobile-first Design, alle Forms validiert mit Zod.
```

## Definition of Done
- Login funktioniert mit realem Supabase User
- Signup erstellt neuen User in Supabase
- Logout redirected zu /login
- Protected Routes funktionieren (Middleware)
- Errors werden user-friendly angezeigt
