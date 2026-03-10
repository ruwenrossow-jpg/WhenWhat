# Auth Setup - Quick Fix Guide

## ⚠️ Falls Login/Signup nicht funktioniert:

### 1. Email Confirmation deaktivieren (für MVP)

**Problem:** Supabase hat standardmäßig Email-Bestätigung aktiviert.
- Nach Signup muss User Email bestätigen
- Login vor Bestätigung schlägt fehl

**Lösung:**
1. Öffne [Supabase Dashboard](https://supabase.com/dashboard)
2. Wähle dein Projekt
3. Gehe zu **Authentication** → **Providers** → **Email**
4. Scrolle zu **"Confirm email"**
5. Schalte auf **OFF**
6. Speichern

### 2. Database Schema ausführen

**Problem:** Events-Tabelle existiert nicht.

**Lösung:**
1. Supabase Dashboard → **SQL Editor**
2. Kopiere gesamten Inhalt von `supabase/schema.sql`
3. Füge ein und klicke **RUN**
4. Sollte erfolgreich durchlaufen

### 3. Test-Account erstellen

**Test-Credentials:**
```
Email: test@test.com
Passwort: Test1234
```

**Flow:**
1. Gehe zu `/signup`
2. Registriere mit obigen Daten
3. Sollte direkt zu `/day` weiterleiten

### 4. Troubleshooting

**Browser Console checken (F12):**
- Gibt es JavaScript-Errors?
- Network Tab: Schau dir POST-Requests an

**Supabase Dashboard checken:**
- Authentication → Users: Wurde der User erstellt?
- Table Editor → events: Existiert die Tabelle?

**Häufige Fehler:**
- `"Invalid login credentials"` → Falsche Email/Passwort
- `"Email not confirmed"` → Email Confirmation ist noch AN (siehe Punkt 1)
- `"User already registered"` → Email bereits verwendet, nutze andere oder Login
- Endlos-Redirect → Cache leeren, Cookies löschen

### 5. Erfolgstest

**Komplett-Flow:**
1. Signup mit `test@test.com` / `Test1234`
2. → Weiterleitung zu `/day`
3. Logout-Button oben rechts klicken
4. → Weiterleitung zu `/login`
5. Login mit gleichen Credentials
6. → Weiterleitung zu `/day`
7. Versuche `/week` zu öffnen (sollte funktionieren)
8. ✅ Auth funktioniert!
