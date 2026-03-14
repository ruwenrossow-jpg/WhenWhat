-- =============================================
-- Migration: Füge color-Spalte zur events Tabelle hinzu
-- =============================================
-- Erstellt: 2026-03-11
-- Problem: Alte events-Tabelle hat keine color-Spalte
-- Lösung: ALTER TABLE um Spalte hinzuzufügen

-- Füge color-Spalte hinzu (falls sie noch nicht existiert)
DO $$ 
BEGIN
  -- Prüfe ob color-Spalte bereits existiert
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'events' 
    AND column_name = 'color'
  ) THEN
    -- Spalte hinzufügen mit Default-Wert
    ALTER TABLE events 
    ADD COLUMN color text DEFAULT 'primary' NOT NULL
    CHECK (color IN ('primary', 'secondary', 'tertiary', 'accent', 'dark', 'light'));
    
    RAISE NOTICE 'color-Spalte wurde erfolgreich hinzugefügt';
  ELSE
    RAISE NOTICE 'color-Spalte existiert bereits';
  END IF;
END $$;

-- Setze alle existierenden Events auf primary (falls NULL)
UPDATE events SET color = 'primary' WHERE color IS NULL;

-- Verifizierung: Zeige Tabellen-Struktur
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;
