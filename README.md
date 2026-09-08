# Iltifot

Shaxsiylashtirilgan "surprise" sahifa yaratuvchi sayt uchun boshlang'ich frontend (Next.js 14 + TypeScript + TailwindCSS).

## Lokal ishga tushirish

```bash
npm install
npm run dev
```

Keyin brauzerda `http://localhost:3000` ni oching.

## GitHub'ga yuklash

```bash
git init
git add .
git commit -m "Iltifot: boshlang'ich landing sahifa"
git branch -M main
git remote add origin <sizning-github-repo-url>
git push -u origin main
```

## Vercel'da deploy qilish (bepul)

1. https://vercel.com ga GitHub hisobingiz bilan kiring
2. "New Project" → shu repo'ni tanlang
3. Framework avtomatik "Next.js" deb aniqlanadi, boshqa sozlash shart emas
4. "Deploy" tugmasini bosing — bir necha daqiqada tayyor bo'ladi

Keyin Vercel loyiha sozlamalaridan domeningizni (masalan `iltifot.uz`) ulashingiz mumkin.

## Hozircha nima tayyor

- Landing sahifa: hero (interaktiv forma + jonli preview), "qanday ishlaydi", mavzular, narxlar, footer
- **Backend ulangan**: forma haqiqiy sahifa yaratadi va noyob havolaga (`/s/abc123`) yo'naltiradi
- Sahifa Supabase'da saqlanadi, 24 soatdan keyin "muddati tugagan" holatini ko'rsatadi
- **Rasm yuklash ishlaydi**: forma ichida rasm tanlash mumkin, Supabase Storage'ga yuklanadi va natija sahifasida ko'rinadi
- Hali yo'q: to'lov (Click/Payme), premium sahifalarni umrbod saqlash tugmasi

## Supabase sozlash (bepul, ~5 daqiqa)

1. https://supabase.com ga kirib, hisob oching, "New Project" yarating
2. Loyiha ochilgach, chap menyudan **SQL Editor** ga o'ting
3. `supabase/schema.sql` faylining butun matnini nusxalab, u yerga joylashtiring va **Run** bosing — bu `pages` jadvalini yaratadi
3-b. Yana "New query" ochib, `supabase/storage.sql` matnini ham xuddi shunday ishga tushiring — bu rasm yuklash uchun `page-images` bucket'ini yaratadi
4. Chap menyudan **Project Settings -> API** ga o'ting, u yerdan 3 ta qiymatni oling:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` kaliti -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` kaliti -> `SUPABASE_SERVICE_ROLE_KEY` (bu maxfiy, hech kimga bermang)
5. Loyiha papkasida `.env.example`ni nusxalab `.env.local` nomi bilan saqlang, yuqoridagi 3 qiymatni joylashtiring:
   ```bash
   cp .env.example .env.local
   ```
6. `npm install && npm run dev` — endi forma haqiqiy sahifa yaratadi

Vercel'da deploy qilganda, xuddi shu 3 ta o'zgaruvchini Vercel loyiha sozlamalarida ("Environment Variables") qo'shishni unutmang.

## Keyingi qadamlar

- **To'lov (Click/Payme)**: foydalanuvchi to'lov qilganda `pages.plan`ni `"premium"`ga va `expires_at`ni `null`ga o'zgartiruvchi API route qo'shish kerak
- **Qizlar uchun teskari oqim**: xuddi shu jadval va API'dan foydalanib, alohida rang sxemasi bilan `/qizlar` sahifasi

Shu qismlarni istalgan vaqt qo'shib davom ettirishim mumkin — aytsangiz bo'ldi.
