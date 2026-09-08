-- Iltifot: "kimga" (munosabat turi) ustuni qo'shish
-- schema.sql va storage.sql'dan keyin, shu faylni ham SQL Editor'da ishga tushiring.

alter table pages
  add column if not exists recipient text not null default 'sevgilim';

-- Mumkin bo'lgan qiymatlar (ilova tomonida tekshiriladi):
-- sevgilim, ona, ota, aka, opa, uka, singil, dost
