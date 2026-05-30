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
