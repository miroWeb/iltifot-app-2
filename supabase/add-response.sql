-- Iltifot: qabul qiluvchining javobini saqlash uchun ustunlar
-- (masalan "Kechirdingizmi?", "Qabul qilaman", "Ha" tugmalariga bosilgan javob).
-- schema.sql va add-recipient.sql'dan keyin shu faylni ham SQL Editor'da ishga tushiring.

alter table pages
  add column if not exists response text,
  add column if not exists responded_at timestamptz;
