-- Run this migration if the original portfolio database already exists.
alter table public.profiles
  add column if not exists whatsapp_phone text;

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
