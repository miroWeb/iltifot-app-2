-- Iltifot: rasm yuklash uchun Storage bucket
-- schema.sql'dan keyin shu faylni ham SQL Editor'da ishga tushiring.

insert into storage.buckets (id, name, public)
values ('page-images', 'page-images', true)
on conflict (id) do nothing;

-- Har kim (anon foydalanuvchi ham) rasm yuklay olishi kerak, chunki saytda
-- login qilish yo'q. Fayl hajmi/turi cheklovi ilova (frontend) tomonida qilinadi.
create policy "Public can upload page images"
  on storage.objects for insert
  to public
  with check (bucket_id = 'page-images');

create policy "Public can view page images"
  on storage.objects for select
  to public
  using (bucket_id = 'page-images');
