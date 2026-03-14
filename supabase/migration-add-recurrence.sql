-- =============================================
-- Migration: Recurring Events V1
-- =============================================
-- Adds recurrence fields to events table and creates
-- exception records for single-occurrence edits/deletes.

alter table events
  add column if not exists is_recurring boolean default false not null,
  add column if not exists recurrence_type text
    check (recurrence_type in ('daily', 'weekly', 'monthly')),
  add column if not exists recurrence_interval integer default 1,
  add column if not exists recurrence_days smallint[],
  add column if not exists recurrence_until date;

alter table events
  add constraint recurrence_interval_valid
  check (recurrence_interval is null or recurrence_interval >= 1);

create table if not exists event_recurrence_exceptions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  occurrence_date date not null,
  is_deleted boolean default false not null,
  title text,
  description text,
  start_time timestamptz,
  end_time timestamptz,
  color text check (color in ('primary', 'secondary', 'tertiary', 'accent', 'dark', 'light')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(event_id, occurrence_date)
);

alter table event_recurrence_exceptions enable row level security;

create policy "Users can CRUD own recurrence exceptions"
  on event_recurrence_exceptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger update_event_recurrence_exceptions_updated_at
  before update on event_recurrence_exceptions
  for each row execute function update_updated_at_column();

create index if not exists events_recurring_lookup_idx
  on events(user_id, is_recurring, start_time, recurrence_until);

create index if not exists recurrence_exceptions_event_date_idx
  on event_recurrence_exceptions(event_id, occurrence_date);
