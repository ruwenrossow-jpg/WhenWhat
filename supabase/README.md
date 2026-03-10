# Supabase Setup Guide

## 1. Neues Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com)
2. Erstelle ein neues Projekt
3. Wähle Region (Europe West für DE)
4. Notiere dir das Database Password

## 2. Schema ausführen

1. Öffne SQL Editor im Supabase Dashboard
2. Kopiere den Inhalt von `supabase/schema.sql`
3. Führe das SQL aus

## 3. Environment Variables

1. Gehe zu Project Settings → API
2. Kopiere die folgenden Werte:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Project API Key (anon, public) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Erstelle `.env.local` im Root:
```bash
cp .env.local.example .env.local
```

4. Fülle die Werte ein

## 4. Testen

- Die App sollte nun mit Supabase verbunden sein
- Auth, RLS und Events-CRUD funktionieren nach Implementierung

## Nächste Schritte

Nach dem Supabase Setup:
- [ ] Phase 3: Auth implementieren
- [ ] Phase 4: Event CRUD implementieren
- [ ] Phase 5: Views implementieren
