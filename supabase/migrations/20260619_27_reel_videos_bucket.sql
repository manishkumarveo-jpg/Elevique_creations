-- Public storage bucket for showcase videos/posters migrated off Cloudinary
insert into storage.buckets (id, name, public, file_size_limit)
values ('reel-videos', 'reel-videos', true, 524288000)
on conflict (id) do nothing;

create policy "Public read access for reel-videos"
on storage.objects for select
using (bucket_id = 'reel-videos');
