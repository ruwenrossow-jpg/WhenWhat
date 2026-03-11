# 🚀 Supabase Database Setup - WICHTIG!

## ⚠️ KRITISCH: Dieses Setup ist ERFORDERLICH für Event-Erstellung

Die Event-Erstellung funktioniert erst, nachdem du das Database Schema in Supabase ausgeführt hast!

---

## Schritt-für-Schritt Anleitung

### 1️⃣ Supabase Dashboard öffnen

1. **Gehe zu:** https://supabase.com/dashboard
2. **Login** mit deinem Account
3. **Wähle dein Projekt:** `etvquufjepyinnfnxzzf` (aus deiner .env.local)

**Direktlink zu deinem Projekt:**
```
https://supabase.com/dashboard/project/etvquufjepyinnfnxzzf
```

---

### 2️⃣ SQL Editor öffnen

1. Im linken Menü: **SQL Editor** klicken
2. Oben rechts: **New Query** Button klicken
3. Ein leerer Editor öffnet sich

**Oder Direktlink:**
```
https://supabase.com/dashboard/project/etvquufjepyinnfnxzzf/sql/new
```

---

### 3️⃣ Schema SQL kopieren

1. **Öffne diese Datei:** `supabase/schema.sql`
2. **Markiere ALLES** (Strg+A / Cmd+A)
3. **Kopiere alles** (Strg+C / Cmd+C)

**Wichtig:** Du musst den KOMPLETTEN Inhalt kopieren (alle 139 Zeilen)!

---

### 4️⃣ Schema im SQL Editor einfügen

1. **Gehe zurück zum SQL Editor in Supabase**
2. **Füge den kopierten Code ein** (Strg+V / Cmd+V)
3. Der gesamte Schema-Code sollte jetzt im Editor sein

---

### 5️⃣ Schema ausführen

1. **Klicke unten rechts:** **RUN** Button
2. **Warte 2-5 Sekunden**
3. **Erfolgsmeldung prüfen:**
   - ✅ Grüner Text: "Success. No rows returned"
   - ❌ Roter Text: Fehler - siehe Fehlerbehebung unten

---

### 6️⃣ Verifizierung: Tables überprüfen

1. Im linken Menü: **Table Editor** klicken
2. **Du solltest sehen:**
   - ✅ `profiles` Tabelle
   - ✅ `events` Tabelle
3. **Klicke auf `events` Tabelle**
4. **Überprüfe die Spalten:**
   - ✅ id (uuid)
   - ✅ user_id (uuid)
   - ✅ title (text)
   - ✅ description (text)
   - ✅ start_time (timestamptz)
   - ✅ end_time (timestamptz)
   - ✅ color (text)
   - ✅ created_at (timestamptz)
   - ✅ updated_at (timestamptz)

**Direktlink zum Table Editor:**
```
https://supabase.com/dashboard/project/etvquufjepyinnfnxzzf/editor
```

---

### 7️⃣ RLS Policies überprüfen

1. **Im Table Editor:** Klicke auf `events` Tabelle
2. **Oben:** Klicke auf Tab **"RLS Policies"** oder **"Authentication"**
3. **Du solltest sehen:**
   - ✅ Policy: "Users can CRUD own events"
   - ✅ Status: Enabled
   - ✅ Command: ALL (SELECT, INSERT, UPDATE, DELETE)

**Falls keine Policy sichtbar:**
- Das Schema wurde nicht vollständig ausgeführt
- Gehe zurück zu Schritt 3 und wiederhole

---

## ✅ Fertig! Test durchführen

1. **Gehe zu deiner App:** http://localhost:3003 (oder deployed URL)
2. **Logge dich ein** (oder registriere dich neu)
3. **Versuche ein Event zu erstellen:**
   - Titel: "Test Event"
   - Beschreibung: "Mein erstes Event"
   - Startzeit: Heute, 10:00
   - Endzeit: Heute, 11:00
   - Farbe: Beliebig
4. **Klicke "Event erstellen"**

### Erwartetes Ergebnis:
- ✅ **Erfolg:** "Event erfolgreich erstellt" Meldung
- ✅ Event erscheint im Kalender
- ✅ Keine Fehlermeldung in der Browser Console (F12)

### Falls es fehlschlägt:
- ❌ Öffne Browser DevTools (F12)
- ❌ Gehe zu **Console** Tab
- ❌ Suche nach `[createEvent]` Logs
- ❌ Schicke mir die Fehlermeldung

---

## 🐛 Fehlerbehebung

### Fehler: "relation 'events' does not exist"
**Problem:** Schema wurde nicht ausgeführt  
**Lösung:** Wiederhole Schritte 3-5

### Fehler: "new row violates row-level security policy"
**Problem:** RLS Policy fehlt oder ist falsch  
**Lösung:**
1. Führe diesen SQL-Befehl im SQL Editor aus:
```sql
-- Check if policy exists
SELECT * FROM pg_policies WHERE tablename = 'events';
```
2. Falls leer: Wiederhole Schritte 3-5 (gesamtes Schema erneut ausführen)

### Fehler: "column 'color' does not exist"
**Problem:** Alte Schema-Version ohne color Spalte  
**Lösung:**
1. **Tabelle löschen und neu erstellen:**
```sql
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```
2. Dann Schritte 3-5 wiederholen

### Fehler: "null value in column 'user_id' violates not-null constraint"
**Problem:** Authentifizierung fehlgeschlagen  
**Lösung:**
1. Logout und erneut Login
2. Browser-Cache leeren
3. Cookies für die Site löschen
4. Erneut versuchen

### Fehler: "permission denied for table events"
**Problem:** Keine RLS Policy oder falsche Policy  
**Lösung:** Führe diesen Fix aus:
```sql
-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can CRUD own events"
  ON events FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## 📝 Was macht dieses Schema?

### Tabelle: `profiles`
- Optional, für später
- Erweitert User-Daten
- Im MVP noch nicht genutzt

### Tabelle: `events`
- **Kern der App!**
- Speichert alle Kalender-Events
- Jeder User kann nur seine eigenen Events sehen
- Farb-Spalte für Wave Brand Colors

### RLS Policies
- **Row Level Security** = Sicherheit auf Zeilen-Ebene
- User können nur ihre eigenen Events lesen/schreiben
- Verhindert, dass User fremde Events sehen/ändern

### Indexes
- Beschleunigen Queries für Day/Week Views
- Wichtig für Performance bei vielen Events

### Triggers
- Automatisches `updated_at` Update
- Auto-Create Profile bei User-Registrierung

---

## 🔗 Nützliche Links

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Dein Projekt:** https://supabase.com/dashboard/project/etvquufjepyinnfnxzzf
- **SQL Editor:** https://supabase.com/dashboard/project/etvquufjepyinnfnxzzf/sql
- **Table Editor:** https://supabase.com/dashboard/project/etvquufjepyinnfnxzzf/editor
- **Supabase Docs - RLS:** https://supabase.com/docs/guides/auth/row-level-security

---

## 💡 Falls du Hilfe brauchst

1. **Check Browser Console** (F12 → Console Tab)
2. **Check Server Logs** (Terminal wo Next.js läuft)
3. **Suche nach `[createEvent]` Logs**
4. **Schicke mir:**
   - Die komplette Fehlermeldung
   - Screenshot vom SQL Editor Fehler
   - Browser Console Log

---

**Viel Erfolg! 🎉**
