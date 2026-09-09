"use client";

import { useState } from "react";

const LINKS = [
  { href: "#qanday-ishlaydi", label: "Qanday ishlaydi" },
  { href: "#kategoriyalar", label: "Yaqinlaringiz" },
  { href: "#narxlar", label: "Tariflar" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative mx-auto max-w-6xl px-6 py-6">
      <div className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose" />
          <span className="font-display text-xl text-ink">Iltifot</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-ink/70 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-ink focus-ring rounded">
              {l.label}
            </a>
          ))}
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
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menyu"
            aria-expanded={open}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink md:hidden"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="absolute inset-x-6 top-full mt-2 flex flex-col gap-1 rounded-2xl border border-ink/10 bg-white p-3 text-sm text-ink/70 shadow-lg md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="focus-ring rounded-xl px-3 py-2.5 hover:bg-ink/5 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
