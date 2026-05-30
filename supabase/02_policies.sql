alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.enquiries enable row level security;

drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events"
on public.events
for select
using (published = true);

drop policy if exists "Demo admin can manage events" on public.events;
create policy "Demo admin can manage events"
on public.events
for all
using (true)
with check (true);

drop policy if exists "Public can submit registrations" on public.registrations;
create policy "Public can submit registrations"
on public.registrations
for insert
with check (true);

drop policy if exists "Demo admin can manage registrations" on public.registrations;
create policy "Demo admin can manage registrations"
on public.registrations
for all
using (true)
with check (true);

drop policy if exists "Public can submit enquiries" on public.enquiries;
create policy "Public can submit enquiries"
on public.enquiries
for insert
with check (true);

drop policy if exists "Demo admin can manage enquiries" on public.enquiries;
create policy "Demo admin can manage enquiries"
on public.enquiries
for all
using (true)
with check (true);
