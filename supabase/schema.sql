-- Iltifot: asosiy jadval
-- Supabase loyihangizda SQL Editor'ga kirib shu faylni to'liq ishga tushiring.

create extension if not exists "pgcrypto";

create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  recipient_name text not null,
  theme text not null default 'shunchaki',        -- uzr | taklif | tugilgan_kun | shunchaki
  color text not null default 'coral',             -- coral | wine | gold
  message text,
  image_url text,
  plan text not null default 'free',                -- free | premium
  created_at timestamptz not null default now(),
  expires_at timestamptz                            -- free uchun created_at + 24 soat, premium uchun null
);

-- Slug bo'yicha tez qidirish uchun
create index if not exists pages_slug_idx on pages (slug);

-- Row Level Security: hozircha public o'qish ochiq (sahifa linkni bilgan har kim ko'ra oladi),
-- yozish faqat backend (service role) orqali.
alter table pages enable row level security;

create policy "Public can read pages by slug"
  on pages for select
  using (true);
