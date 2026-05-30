create table if not exists public.events (
  id text primary key,
  title text not null,
  category text not null,
  event_date date not null,
  start_time time,
  end_time time,
  duration text,
  mode text,
  location text,
  total_seats integer not null default 0,
  seats_filled integer not null default 0,
  status text not null default 'Draft',
  short_description text,
  full_description text,
  related_course_url text,
  image text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_seats_check check (seats_filled <= total_seats)
);

-- Demo-friendly policies for the current static admin.
-- Before production, replace the "Demo admin" policies with authenticated
-- admin-only policies using Supabase Auth.

create table if not exists public.registrations (
  id text primary key,
  name text not null,
  phone text not null,
  email text,
  event_title text not null,
  course text not null,
  event_date date not null,
  source text not null default 'Calendar Form',
  status text not null default 'New',
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id text primary key,
  name text not null,
  phone text not null,
  email text,
  interested_course text not null,
  message text,
  enquiry_date date not null default current_date,
  source text not null default 'Calendar Form',
  status text not null default 'New',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.enquiries enable row level security;

drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events"
on public.events for select
using (published = true);

drop policy if exists "Demo admin can manage events" on public.events;
create policy "Demo admin can manage events"
on public.events for all
using (true)
with check (true);

drop policy if exists "Public can submit registrations" on public.registrations;
create policy "Public can submit registrations"
on public.registrations for insert
with check (true);

drop policy if exists "Demo admin can manage registrations" on public.registrations;
create policy "Demo admin can manage registrations"
on public.registrations for all
using (true)
with check (true);

drop policy if exists "Public can submit enquiries" on public.enquiries;
create policy "Public can submit enquiries"
on public.enquiries for insert
with check (true);

drop policy if exists "Demo admin can manage enquiries" on public.enquiries;
create policy "Demo admin can manage enquiries"
on public.enquiries for all
using (true)
with check (true);

insert into public.events (
  id, title, category, event_date, start_time, end_time, duration, mode, location,
  total_seats, seats_filled, status, short_description, full_description,
  related_course_url, image, published
) values
('evt_001', 'HACCP Level 3 - Supervisory Level', 'HACCP Level 3', '2026-06-15', '09:00', '17:00', '1 Day', 'Classroom / Online', 'Training Center / Online', 25, 18, 'Seats Open', 'A focused 1-day program for supervisors, QA/QC staff, and fresh graduates.', 'Detailed description of the course/event.', 'haccp-level-3.html', 'assets/modern_industrial_training_in_action.png', true),
('evt_002', 'HACCP Level 4 - Advanced Management Level', 'HACCP Level 4', '2026-06-22', '09:00', '17:00', '40 Hours', 'Structured Program', 'Training Center / Online', 20, 12, 'Enquiry Open', 'Advanced management-level HACCP training for QA/QC professionals and leaders.', 'Detailed description of the course/event.', 'haccp-level-4.html', 'assets/collaborative_training_in_a_modern_lab.png', true),
('evt_003', 'Free Food Safety Awareness Session', 'Workshop', '2026-06-30', '18:00', '20:00', '2 Hours', 'Online Webinar', 'Online Webinar', 100, 35, 'Registration Open', 'Introductory awareness session for learners exploring food safety and HACCP.', 'Detailed description of the course/event.', 'food-safety-haccp-advanced.html', 'assets/modern_educational_course_offerings_layout.png', true),
('evt_004', 'Food Safety Career Guidance Session', 'Career Session', '2026-07-05', '19:00', '20:00', '1 Hour', 'Online', 'Online', 30, 10, 'Limited Seats', 'Career guidance for graduates and professionals entering the food safety industry.', 'Detailed description of the course/event.', 'food-safety-haccp-advanced.html', 'assets/professional_consultation_in_modern_office.png', true)
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  event_date = excluded.event_date,
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  duration = excluded.duration,
  mode = excluded.mode,
  location = excluded.location,
  total_seats = excluded.total_seats,
  seats_filled = excluded.seats_filled,
  status = excluded.status,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  related_course_url = excluded.related_course_url,
  image = excluded.image,
  published = excluded.published,
  updated_at = now();
