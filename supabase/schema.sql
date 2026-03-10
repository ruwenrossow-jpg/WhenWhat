-- =============================================
-- WhenWhat Solo-Kalender MVP - Datenbank Schema
-- =============================================
-- Erstellt für: Supabase PostgreSQL
-- Version: 1.0
-- Datum: 2026-03-10

-- =============================================
-- Profiles (optional)
-- =============================================
-- Erweitert auth.users mit zusätzlichen Feldern
-- Im MVP minimal gehalten

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS für Profiles
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- =============================================
-- Events (Kern des MVPs)
-- =============================================
-- Persönliche Kalender-Events
-- Jeder User kann nur seine eigenen Events sehen/bearbeiten

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  
  -- Event Details
  title text not null,
  description text,
  
  -- Zeitangaben
  start_time timestamptz not null,
  end_time timestamptz not null,
  
  -- Farbe für Event (Wave Brand Colors)
  color text default 'primary' not null 
    check (color in ('primary', 'secondary', 'tertiary', 'accent', 'dark', 'light')),
  
  -- Metadaten
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Constraints
  constraint valid_time_range check (end_time > start_time),
  constraint title_not_empty check (char_length(title) > 0),
  constraint title_max_length check (char_length(title) <= 200)
);

-- RLS für Events
alter table events enable row level security;

create policy "Users can CRUD own events"
  on events for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================
-- Indexes für Performance
-- =============================================

-- Index für User-Events Suche
create index if not exists events_user_id_idx on events(user_id);

-- Index für Zeitbasierte Queries (Day/Week View)
create index if not exists events_start_time_idx on events(start_time);
create index if not exists events_user_id_start_time_idx on events(user_id, start_time);

-- =============================================
-- Functions & Triggers
-- =============================================

-- Automatisches updated_at Update
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger für Events
create trigger update_events_updated_at before update on events
  for each row execute function update_updated_at_column();

-- Trigger für Profiles
create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at_column();

-- =============================================
-- Auto-Create Profile on Signup (optional)
-- =============================================
-- Erstellt automatisch ein Profile wenn ein User sich registriert

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================
-- Notizen für Erweiterungen (Post-MVP)
-- =============================================
-- Später hinzufügbar:
-- - event_categories (Tags)
-- - event_recurrence (Wiederholende Events)
-- - event_reminders (Benachrichtigungen)
-- - visibility/privacy_level (Wenn Social Features kommen)
