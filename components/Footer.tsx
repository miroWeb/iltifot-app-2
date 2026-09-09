export default function Footer() {
  return (
    <footer className="bg-footerDark py-16 text-cream/70">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose" />
              <span className="font-display text-xl text-cream">Iltifot</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Insonlarni yaqinlashtiradigan samimiy va interaktiv tabriklar
              platformasi. Sevgingizni chiroyli ko'rsating.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-cream/40">
              PLATFORMA
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#qanday-ishlaydi" className="hover:text-cream">Qanday ishlaydi?</a></li>
              <li><a href="#kategoriyalar" className="hover:text-cream">Xizmatlarimiz</a></li>
              <li><a href="#" className="hover:text-cream">Wow effektlar</a></li>
              <li><a href="#narxlar" className="hover:text-cream">Narxlar</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-cream/40">
              YORDAM
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="hover:text-cream">Tezkor aloqa</a></li>
              <li><a href="#" className="hover:text-cream">Savollar</a></li>
              <li><a href="#" className="hover:text-cream">Yordam markazi</a></li>
              <li><a href="#" className="hover:text-cream">Foydalanish shartlari</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-6 text-xs sm:flex-row">
          <span>&copy; 2026 Iltifot. Barcha huquqlar himoyalangan.</span>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-cream">Telegram</a>
            <a href="#" className="hover:text-cream">Instagram</a>
            <span>UZ | RU</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
