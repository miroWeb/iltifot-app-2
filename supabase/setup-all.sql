-- Iltifot: barcha migratsiyalarni bittada ishga tushirish uchun.
-- Supabase loyihangizda SQL Editor'ga kirib shu faylni to'liq nusxalab,
-- "Run" tugmasini bosing. Qayta ishga tushirish ham xavfsiz (idempotent).

create extension if not exists "pgcrypto";

create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  recipient_name text not null,
  theme text not null default 'shunchaki',
  color text not null default 'coral',
  message text,
  image_url text,
  plan text not null default 'free',
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists pages_slug_idx on pages (slug);

alter table pages enable row level security;

drop policy if exists "Public can read pages by slug" on pages;
create policy "Public can read pages by slug"
  on pages for select
  using (true);

-- Rasm yuklash uchun Storage bucket
insert into storage.buckets (id, name, public)
values ('page-images', 'page-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can upload page images" on storage.objects;
create policy "Public can upload page images"
  on storage.objects for insert
  to public
  with check (bucket_id = 'page-images');

drop policy if exists "Public can view page images" on storage.objects;
create policy "Public can view page images"
  on storage.objects for select
  to public
  using (bucket_id = 'page-images');

-- "Kimga" (munosabat turi) ustuni
alter table pages
  add column if not exists recipient text not null default 'sevgilim';

-- Qabul qiluvchining javobini saqlash uchun ustunlar
alter table pages
  add column if not exists response text,
  add column if not exists responded_at timestamptz;

-- PostgREST keshini majburan yangilash (ustunlar "topilmadi" xatosining oldini oladi)
notify pgrst, 'reload schema';
