create table meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  scheduled_at timestamptz not null,
  client_id uuid references profiles(id) on delete set null,
  assigned_team_member_id uuid references profiles(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  notes text,
  attended_by_team boolean not null default false,
  attended_at timestamptz,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

alter table meetings enable row level security;

create policy "admins_full_access" on meetings
  for all using (is_admin());

create policy "team_see_own_meetings" on meetings
  for select using (assigned_team_member_id = auth.uid());

create policy "team_update_own_meetings" on meetings
  for update using (assigned_team_member_id = auth.uid());

create policy "client_see_own_meetings" on meetings
  for select using (client_id = auth.uid());

create index meetings_scheduled_at_idx on meetings (scheduled_at);
create index meetings_client_id_idx on meetings (client_id);
create index meetings_team_member_id_idx on meetings (assigned_team_member_id);
