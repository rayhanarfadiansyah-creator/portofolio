-- Run this in Supabase SQL Editor.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Your Name',
  headline text not null default 'I build thoughtful digital experiences.',
  bio text not null default '',
  status text not null default 'student' check (status in ('student','graduated','working','freelancer')),
  institution text,
  location text,
  email text,
  avatar_url text,
  cv_url text,
  github_url text,
  linkedin_url text,
  whatsapp_phone text,
  is_public boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists whatsapp_phone text;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  image_url text,
  live_url text,
  github_url text,
  technologies text[] not null default '{}',
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;

-- Public can read only public profile and published projects.
create policy "Public reads visible profiles" on public.profiles
for select using (is_public = true or auth.uid() = id);
create policy "Owner inserts own profile" on public.profiles
for insert with check (auth.uid() = id);
create policy "Owner updates own profile" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Public reads published projects" on public.projects
for select using (is_published = true or auth.uid() = user_id);
create policy "Owner inserts own projects" on public.projects
for insert with check (auth.uid() = user_id);
create policy "Owner updates own projects" on public.projects
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Owner deletes own projects" on public.projects
for delete using (auth.uid() = user_id);

-- Create a private admin user through Supabase Dashboard > Authentication > Users.
-- The first signed-in admin creates their profile through /admin.


-- CV uploads: a public-read bucket so visitors can download the public CV.
-- Only authenticated owners can upload, replace, or delete files in their own folder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-assets', 'portfolio-assets', true, 8388608, array['application/pdf'])
on conflict (id) do update set
  public = true,
  file_size_limit = 8388608,
  allowed_mime_types = array['application/pdf'];

drop policy if exists "Public can read portfolio CV files" on storage.objects;
create policy "Public can read portfolio CV files"
on storage.objects for select
using (bucket_id = 'portfolio-assets');

drop policy if exists "Owner uploads portfolio CV" on storage.objects;
create policy "Owner uploads portfolio CV"
on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio-assets' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Owner replaces portfolio CV" on storage.objects;
create policy "Owner replaces portfolio CV"
on storage.objects for update to authenticated
using (bucket_id = 'portfolio-assets' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'portfolio-assets' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Owner deletes portfolio CV" on storage.objects;
create policy "Owner deletes portfolio CV"
on storage.objects for delete to authenticated
using (bucket_id = 'portfolio-assets' and (storage.foldername(name))[1] = auth.uid()::text);
