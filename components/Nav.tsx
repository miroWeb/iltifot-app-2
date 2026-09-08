export default function Nav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <a href="/" className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-rose" />
        <span className="font-display text-xl text-ink">Mehrim</span>
      </a>
      <nav className="hidden items-center gap-8 text-sm text-ink/70 md:flex">
        <a href="#qanday-ishlaydi" className="hover:text-ink focus-ring rounded">
          Qanday ishlaydi
        </a>
        <a href="#kategoriyalar" className="hover:text-ink focus-ring rounded">
          Yaqinlaringiz
        </a>
        <a href="#narxlar" className="hover:text-ink focus-ring rounded">
          Tariflar
        </a>
      </nav>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1 rounded-full border border-ink/10 bg-white px-1 py-1 text-xs sm:flex">
          <span className="rounded-full bg-ink/5 px-2.5 py-1 font-medium text-ink">
            UZ
          </span>
          <span className="px-2.5 py-1 text-ink/50">RU</span>
        </div>
        <a
          href="#kategoriyalar"
          className="focus-ring rounded-full bg-rose px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose2"
        >
          Boshlash
        </a>
      </div>
    </header>
  );
}
